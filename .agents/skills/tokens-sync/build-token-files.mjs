// Assembles token JSON files from use_figma export parts (see export-vars.js).
// Usage: node build-token-files.mjs <manifest.json>
// Manifest shape: { "tokensDir": "packages/ui-components/tokens",
//   "files": [ { "out": "semantic/dark.json", "parts": ["/abs/path/part1.json", ...] }, ... ] }
// Each part is the JSON returned by one export-vars.js call:
//   { collection, entries: [[path, value, type], ...], issues: [...] }
import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

function setNested(obj, dotPath, leaf) {
	const keys = dotPath.split('.');
	let cur = obj;
	for (const key of keys.slice(0, -1)) {
		if (!(key in cur)) cur[key] = {};
		cur = cur[key];
	}
	cur[keys[keys.length - 1]] = leaf;
}

// Canonical ordering: Figma enumerates variables in internal creation order, which
// drifts over time, so both this assembler and the figma plugin sort keys naturally
// to keep diffs stable and tool-independent.
function sortDeep(node) {
	if (!node || typeof node !== 'object' || Array.isArray(node) || 'value' in node) return node;
	const sorted = {};
	for (const key of Object.keys(node).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
		sorted[key] = sortDeep(node[key]);
	}
	return sorted;
}

// Big collections are exported in slices, so a manifest that is missing one of them
// would otherwise assemble a partial file that looks perfectly healthy and silently
// drop the omitted tokens. Check the slices declared by the exporter instead: they
// must agree on the collection size, hold the entries they claim, and cover [0, total)
// exactly once.
function checkSliceCoverage(parts) {
	const problems = [];
	const totals = [...new Set(parts.map(p => p.total))];
	if (totals.some(t => !Number.isInteger(t))) {
		return ['a part is missing the exporter\'s total/start/end — save each use_figma return verbatim'];
	}
	if (totals.length !== 1) {
		return [`slices disagree on the collection size (total: ${totals.join(', ')})`];
	}
	const total = totals[0];
	const slices = [];
	for (const part of parts) {
		const start = Math.min(Math.max(part.start ?? 0, 0), total);
		const end = Math.min(Math.max(part.end ?? total, start), total);
		const expected = end - start;
		if (part.entries.length !== expected) {
			problems.push(`slice [${start}, ${end}) holds ${part.entries.length} entries, expected ${expected}`);
		}
		slices.push([start, end]);
	}
	slices.sort((a, b) => a[0] - b[0]);
	let cursor = 0;
	for (const [start, end] of slices) {
		if (start > cursor) problems.push(`slices skip [${cursor}, ${start}) of ${total}`);
		else if (start < cursor) problems.push(`slices overlap at [${start}, ${cursor}) of ${total}`);
		cursor = Math.max(cursor, end);
	}
	if (cursor < total) problems.push(`slices stop at ${cursor} of ${total}`);
	return problems;
}

// Pass 1 — assemble every file in memory and collect problems. Nothing is written
// yet: a sync that fails must leave the existing token files untouched, so a bad
// export can never half-overwrite the tokens directory.
const assembled = [];
const failures = [];

for (const file of manifest.files) {
	const tree = {};
	const issues = [];
	let collectionName = '';
	let entryCount = 0;
	const parts = file.parts.map(partPath => JSON.parse(fs.readFileSync(partPath, 'utf8')));
	for (const problem of checkSliceCoverage(parts)) {
		failures.push(`${file.out}: ${problem}`);
	}
	for (const part of parts) {
		collectionName = part.collection;
		issues.push(...(part.issues || []));
		// Same prefix rule as the figma plugin: collection name, lowercased, "/" and spaces -> "_"
		const prefix = part.collection.toLowerCase().replace(/[\/\s]/g, '_');
		for (const [tokenPath, value, type] of part.entries) {
			setNested(tree, tokenPath, { value, type, prefix });
			entryCount++;
		}
	}
	if (issues.length) {
		failures.push(`${file.out}: ${issues.length} UNRESOLVED: ${issues.join(', ')}`);
	}
	// An export that yields nothing is never legitimate here — every mapped collection
	// has variables, so an empty tree means a bad collection or mode id, not an empty file
	if (entryCount === 0) {
		failures.push(`${file.out}: no entries — check the collection and mode ids`);
	}
	assembled.push({ out: file.out, collectionName, entryCount, tree });
}

if (failures.length) {
	console.error('Refusing to write — the existing token files are left untouched:');
	for (const failure of failures) console.error(`  ${failure}`);
	process.exit(1);
}

// Pass 2 — every file assembled cleanly, so the tokens directory can be replaced
for (const file of assembled) {
	const outPath = path.join(manifest.tokensDir, file.out);
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	// No trailing newline — byte-for-byte parity with the figma plugin's output
	fs.writeFileSync(outPath, JSON.stringify(sortDeep(file.tree), null, 2));
	console.log(`${file.out}: ${file.collectionName} (${file.entryCount} tokens)`);
}

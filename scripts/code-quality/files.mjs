import { execFileSync } from 'node:child_process';

/** Keep refs and filenames in argv; user input never goes through a shell. */
const git = (root, args) =>
	execFileSync('git', args, {
		cwd: root,
		encoding: 'utf8',
		stdio: 'pipe',
		maxBuffer: 32 * 1024 * 1024
	});

/** Read Git output as NUL-separated paths so spaces and newlines remain literal filenames. */
export const gitPaths = (root, args) =>
	git(root, args).split('\0').filter(Boolean);

/**
 * @typedef {object} ChangedRange
 * @property {number} from - First added line, or the line before a deletion.
 * @property {number} to - Last added line, or the line after a deletion.
 * @property {boolean} [deletion] - The hunk removed lines without adding any.
 * @property {boolean} [docblockOnly] - The removed content contains only comments including JSDoc.
 */

/**
 * Preserve deletion boundaries without treating unchanged neighboring lines as additions.
 * @param {string} diff - A single-file Git diff with zero context lines.
 * @returns {ChangedRange[]} Added ranges and deletion metadata for unit selection.
 */
export const changedRanges = (diff) =>
	diff.split(/(?=^@@ )/m).flatMap((hunk) => {
		const match = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(hunk);

		if (!match) {
			return [];
		}

		const from = Number(match[1]);
		const count = Number(match[2] ?? 1);

		const removed = hunk
			.split('\n')
			.filter((line) => line.startsWith('-'))
			.map((line) => line.slice(1))
			.join('\n');
		const docblockOnly =
			/\/\*\*/.test(removed) &&
			removed
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.replace(/\/\/[^\n]*/g, '')
				.trim() === '';

		if (count) {
			return [{ from, to: from + count - 1, docblockOnly }];
		}

		return [{ from, to: from + 1, deletion: true, docblockOnly }];
	});

/**
 * List tracked changes since a commit, keeping the rename source a later range diff needs.
 * A destination-only diff makes moved, unchanged content look newly added.
 * @param {string} root - Repository root.
 * @param {string} base - Commit compared with the working tree.
 * @param {function(string): boolean} inherits - Whether a renamed file keeps its source's
 * unchanged lines out of scope; moving code into a checker's scope makes the whole file new.
 * @returns {Map<string, string[]>} Current paths mapped to the paths whose diff describes them.
 */
export const listChanges = (root, base, inherits) => {
	const entries = gitPaths(root, [
		'diff',
		'--name-status',
		'--find-renames',
		'--diff-filter=ACMR',
		'-z',
		base,
		'--'
	]);
	const changes = new Map();

	for (let index = 0; index < entries.length; ) {
		const status = entries[index++];
		const original = entries[index++];
		const paired = status.startsWith('R') || status.startsWith('C');
		const filename = paired ? entries[index++] : original;

		changes.set(
			filename,
			status.startsWith('R') && inherits(original)
				? [original, filename]
				: [filename]
		);
	}

	return changes;
};

/**
 * Read one change's line ranges, following its rename source when one is listed.
 * @param {string} root - Repository root.
 * @param {string} base - Commit compared with the working tree.
 * @param {string[]} paths - The paths `listChanges` returned for the file, matched literally.
 * @returns {ChangedRange[]} Line ranges in the current file.
 */
export const readRanges = (root, base, paths) =>
	changedRanges(
		git(root, [
			'--literal-pathspecs',
			'diff',
			'--unified=0',
			'--no-ext-diff',
			'--find-renames',
			base,
			'--',
			...paths
		])
	);

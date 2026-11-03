// use_figma snippet — exports one slice of one variable collection as flat token entries.
// Replace __COLLECTION_ID__, __MODE_ID__, __START__, __END__ before each call.
// Conversion rules are a port of packages/ui-components/figma-plugin/code.js — keep them in sync.
const COLLECTION_ID = "__COLLECTION_ID__";
const MODE_ID = "__MODE_ID__";
const START = __START__;
const END = __END__;

const all = await figma.variables.getLocalVariablesAsync();
const byId = new Map(all.map(v => [v.id, v]));

function rgbaToHex(c) {
	const h = x => Math.round(x * 255).toString(16).padStart(2, "0");
	const base = `#${h(c.r)}${h(c.g)}${h(c.b)}`;
	return c.a !== undefined && c.a < 1 ? base + h(c.a) : base;
}

function resolveRaw(value, depth = 0) {
	if (depth > 10) return null;
	if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
		const ref = byId.get(value.id);
		if (!ref) return null;
		return resolveRaw(Object.values(ref.valuesByMode)[0], depth + 1);
	}
	return value;
}

function composeAlpha(colorValue, alphaValue) {
	const base = resolveRaw(colorValue);
	if (!base || typeof base !== "object" || !("r" in base)) return null;
	let alpha = resolveRaw(alphaValue);
	if (typeof alpha !== "number") return null;
	if (alpha > 1) alpha = alpha / 100;
	return rgbaToHex({ r: base.r, g: base.g, b: base.b, a: alpha });
}

function convert(value, resolvedType, path) {
	if (value && typeof value === "object" && value.type === "VARIABLE_EXPRESSION") {
		if (value.expressionFunction === "COMPOSE_COLOR") {
			const a = value.expressionArguments || [];
			return composeAlpha(a[0], a[1]);
		}
		return null;
	}
	if (value && typeof value === "object" && "color" in value && "opacity" in value) {
		return composeAlpha(value.color, value.opacity);
	}
	if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
		const ref = byId.get(value.id);
		return ref ? `{${ref.name.replace(/\//g, ".")}}` : null;
	}
	if (resolvedType === "COLOR" && typeof value === "object" && "r" in value) {
		return rgbaToHex(value);
	}
	const lower = path.toLowerCase();
	const unitless = lower.includes("weight") || lower.includes("opacity");
	if (resolvedType === "FLOAT" && typeof value === "number") {
		return unitless ? value : `${value}px`;
	}
	if (value && typeof value === "object") return null;
	return value;
}

const typeMap = { COLOR: "color", FLOAT: "number", STRING: "string", BOOLEAN: "boolean" };
const collection = await figma.variables.getVariableCollectionByIdAsync(COLLECTION_ID);
if (!collection) throw new Error(`Unknown collection id ${COLLECTION_ID} — re-read the collections (step 1)`);
// Collection and mode ids change when a collection is recreated in Figma. A stale id
// would make every lookup below miss and return an empty-but-clean export, so fail loudly
if (!collection.modes.some(m => m.modeId === MODE_ID)) {
	const known = collection.modes.map(m => `${m.name}=${m.modeId}`).join(', ');
	throw new Error(`Mode ${MODE_ID} is not a mode of "${collection.name}" (has: ${known})`);
}
// Iterate in getLocalVariablesAsync() order, like the figma plugin does — NOT in
// collection.variableIds order, which differs and would reorder the generated JSON
const collectionVars = all.filter(v => v.variableCollectionId === COLLECTION_ID);
const entries = [];
const issues = [];
for (const v of collectionVars.slice(START, END)) {
	const path = v.name.replace(/\//g, ".");
	// Every variable carries a value for every mode of its collection, so a miss here
	// is a real anomaly — report it instead of silently dropping the token
	if (!(MODE_ID in v.valuesByMode)) { issues.push(path); entries.push([path, null, typeMap[v.resolvedType] || "string"]); continue; }
	const modeValue = v.valuesByMode[MODE_ID];
	const converted = convert(modeValue, v.resolvedType, path);
	if (converted === null || converted === undefined) issues.push(path);
	entries.push([path, converted, typeMap[v.resolvedType] || "string"]);
}
return { collection: collection.name, total: collectionVars.length, start: START, end: END, issues, entries };

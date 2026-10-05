import { ERRORS_KEY, ErrorSchema, RJSFSchema, RJSFValidationError, findSchemaDefinition } from '@rjsf/utils';
import { get, isEqual, isPlainObject, upperFirst } from 'lodash';

/** Copy server errors into RJSF's object tree, preserving sparse array indexes. */
export function sanitizeExtraErrors<T = unknown>(node: unknown): ErrorSchema<T> | undefined {
	if (!Array.isArray(node) && !isPlainObject(node)) return undefined;
	const entries: [string, unknown][] = [];
	for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
		if (key === ERRORS_KEY) {
			const messages = Array.isArray(child) ? [...child] : [];
			if (messages.length && messages.every(message => typeof message === 'string')) entries.push([key, messages]);
		} else {
			const branch = sanitizeExtraErrors(child);
			if (branch) entries.push([key, branch]);
		}
	}
	return entries.length ? (Object.fromEntries(entries) as ErrorSchema<T>) : undefined;
}

const pluralize = (count: number, singular: string, plural = `${singular}s`) => (count === 1 ? singular : plural);
const AN_TYPES = new Set(['array', 'integer', 'object']);

const friendlyMessage = ({ name, params = {} }: RJSFValidationError): string | undefined => {
	switch (name) {
		case 'required':
			return 'This field is required.';
		case 'minLength':
		case 'maxLength':
			return `Must be ${name === 'minLength' ? 'at least' : 'at most'} ${params.limit} ${pluralize(params.limit, 'character')}.`;
		case 'minimum':
		case 'maximum':
			return `Must be ${params.limit} or ${name === 'minimum' ? 'more' : 'less'}.`;
		case 'exclusiveMinimum':
		case 'exclusiveMaximum':
			return `Must be ${name === 'exclusiveMinimum' ? 'greater' : 'less'} than ${params.limit}.`;
		case 'pattern':
			return `Must match the pattern "${params.pattern}".`;
		case 'format':
			return `Must be a valid ${params.format}.`;
		case 'minItems':
		case 'maxItems':
		case 'minProperties':
		case 'maxProperties':
			return `Must have ${name.startsWith('min') ? 'at least' : 'at most'} ${params.limit} ${
				name.endsWith('Items') ? pluralize(params.limit, 'item') : pluralize(params.limit, 'property', 'properties')
			}.`;
		case 'uniqueItems':
			return 'Items must be unique.';
		case 'enum': {
			const values: unknown[] = Array.isArray(params.allowedValues) ? params.allowedValues : [];
			return values.length && values.length <= 5
				? `Must be one of: ${values.map(value => (isPlainObject(value) || Array.isArray(value) ? JSON.stringify(value) : String(value))).join(', ')}.`
				: 'Must be one of the allowed values.';
		}
		case 'const':
			return 'Must be equal to the allowed value.';
		case 'type': {
			const types: string[] = (Array.isArray(params.type) ? params.type : [params.type]).filter(Boolean);
			return types.length ? `Must be ${AN_TYPES.has(types[0]) ? 'an' : 'a'} ${types.join(' or ')}.` : undefined;
		}
		case 'multipleOf':
			return `Must be a multiple of ${params.multipleOf}.`;
		case 'oneOf':
			return Array.isArray(params.passingSchemas) && params.passingSchemas.length > 1
				? 'Matches more than one of the allowed options; it must match exactly one.'
				: 'Must match exactly one of the allowed options.';
		case 'anyOf':
			return 'Does not match any of the allowed options.';
		case 'not':
			return "This value isn't allowed.";
		case 'additionalProperties':
			return params.additionalProperty ? `"${params.additionalProperty}" isn't an allowed property.` : undefined;
		case 'dependencies':
		case 'dependentRequired':
			return params.missingProperty && params.property ? `"${params.missingProperty}" is required when "${params.property}" is set.` : undefined;
		default:
			return undefined;
	}
};

function friendlyStack(error: RJSFValidationError, message: string): string {
	// RJSF embeds a required field's resolved title in the message rather than a prefix.
	const title = error.name === 'required' ? error.stack?.match(/required property ('[\s\S]*')$/)?.[1] : undefined;
	if (title) return `${title} ${message}`;
	const prefix = error.message && error.stack?.endsWith(error.message) ? error.stack.slice(0, -error.message.length) : undefined;
	if (prefix) return `${prefix}${message}`;
	if (error.stack && (error.stack !== error.message || ['required', 'dependencies', 'dependentRequired'].includes(error.name ?? ''))) return error.stack;
	return error.property ? `${error.property} ${message}` : message;
}

/** Rewrite validator messages without mutating errors or discarding their title information. */
export function humanizeSchemaErrors(errors: RJSFValidationError[]): RJSFValidationError[] {
	let changed = false;
	const result = errors.map(error => {
		if (error.message === undefined || error.message === null) return error;
		const message = friendlyMessage(error) ?? upperFirst(error.message);
		if (message === error.message) return error;
		changed = true;
		return { ...error, message, stack: friendlyStack(error, message) };
	});
	return changed ? result : errors;
}

const OPTION_KEYWORDS = new Set(['oneOf', 'anyOf']);
const DISCRIMINATOR_KEYWORDS = new Set(['const', 'enum', 'not']);
const SCHEMA_MAP_KEYWORDS = new Set(['properties', 'patternProperties', '$defs', 'definitions', 'dependencies', 'dependentSchemas']);
const VALUE_KEYWORDS = new Set(['const', 'enum', 'default', 'examples']);
const decodePointer = (segment: string) => segment.replace(/~1/g, '/').replace(/~0/g, '~');

function hasSchemaReference(node: unknown, map = false): boolean {
	if (Array.isArray(node)) return node.some(child => hasSchemaReference(child));
	if (!isPlainObject(node)) return false;
	return Object.entries(node as Record<string, unknown>).some(([key, child]) =>
		map ? hasSchemaReference(child) : key === '$ref' || (!VALUE_KEYWORDS.has(key) && hasSchemaReference(child, SCHEMA_MAP_KEYWORDS.has(key)))
	);
}

function followRefs(rootSchema: RJSFSchema, node: unknown): unknown {
	if (!isPlainObject(node) || typeof get(node, '$ref') !== 'string') return node;
	const { $ref, ...local } = node as { $ref: string };
	try {
		return { ...findSchemaDefinition($ref, rootSchema), ...local };
	} catch {
		return node;
	}
}

function resolvePointer(rootSchema: RJSFSchema, pointer: string): unknown {
	return pointer
		.replace(/^#\/?/, '')
		.split('/')
		.reduce<unknown>((node, segment) => get(followRefs(rootSchema, node), [decodePointer(segment)]), rootSchema);
}

function pinnedValues(node: unknown): unknown[] {
	if (!isPlainObject(node)) return [];
	if (Object.prototype.hasOwnProperty.call(node, 'const')) return [get(node, 'const')];
	const values = get(node, 'enum') as unknown;
	return Array.isArray(values) && values.length === 1 ? values : [];
}

type OptionMetadata = { optionCount: number; discriminating: Map<string, unknown[]>; rootPins: unknown[]; complements: Map<string, boolean> };
function optionMetadata(rootSchema: RJSFSchema, path: string): OptionMetadata | undefined {
	const options = resolvePointer(rootSchema, path);
	if (!Array.isArray(options) || !options.length || options.some(option => hasSchemaReference(option))) return undefined;
	const properties = options.map(option => (isPlainObject(get(option, 'properties')) ? get(option, 'properties') : {}) as Record<string, unknown>);
	const discriminating = new Map<string, unknown[]>();
	for (const name of Object.keys(properties[0])) {
		if (!properties.every(property => Object.prototype.hasOwnProperty.call(property, name))) continue;
		const values = properties.flatMap(property => pinnedValues(property[name]));
		if (values.length) discriminating.set(name, values);
	}
	return { optionCount: options.length, discriminating, rootPins: options.flatMap(pinnedValues), complements: new Map() };
}

/** A negated value identifies a complement only when every exclusion is pinned by an option. */
function isComplementGuard(node: unknown, pins: unknown[] | undefined): boolean {
	if (!pins?.length || !isPlainObject(node) || Object.keys(node as object).length !== 1) return false;
	const values = Object.prototype.hasOwnProperty.call(node, 'const') ? [get(node, 'const')] : (get(node, 'enum') as unknown);
	return Array.isArray(values) && values.length > 0 && values.every(value => pins.some(pin => isEqual(value, pin)));
}

function isDiscriminatorError(error: RJSFValidationError, branchPath: string, metadata: OptionMetadata, rootSchema: RJSFSchema): boolean {
	if (!DISCRIMINATOR_KEYWORDS.has(error.name ?? '') || !error.schemaPath?.startsWith(branchPath)) return false;
	if (error.name === 'enum') {
		const values = Array.isArray(error.params?.allowedValues) ? error.params.allowedValues : resolvePointer(rootSchema, error.schemaPath);
		if (!Array.isArray(values) || values.length !== 1) return false;
	}
	const segments = error.schemaPath.slice(branchPath.length).split('/');
	const rootError = segments.length === 1;
	const pins = rootError ? metadata.rootPins : segments.length === 3 && segments[0] === 'properties' ? metadata.discriminating.get(decodePointer(segments[1])) : undefined;
	if (!rootError && !pins) return false;
	if (error.name !== 'not') return true;
	// Each schema constraint is classified once, including across repeated array items.
	let complement = metadata.complements.get(error.schemaPath);
	if (complement === undefined) {
		complement = isComplementGuard(resolvePointer(rootSchema, error.schemaPath), pins);
		metadata.complements.set(error.schemaPath, complement);
	}
	return complement;
}

type OptionBranch = { errors: RJSFValidationError[]; children: OptionGroup[]; dropped?: boolean };
type OptionGroup = { selectors: RJSFValidationError[]; branches: Map<string, OptionBranch>; parent?: OptionBranch; dropSelector?: boolean };

/**
 * Prune option noise only when one branch retains content errors and has no discriminator
 * mismatch. Store each error at its nearest group and inspect nested groups first.
 * Referenced, unresolved, incomplete and ambiguous options retain their errors, including their selector.
 */
export function pruneOptionErrors(errors: RJSFValidationError[], rootSchema?: RJSFSchema): RJSFValidationError[] {
	if (!rootSchema) return errors;
	const groups = new Map<string, Map<string, OptionGroup>>();
	const levels: OptionGroup[][] = [];
	for (const error of errors) {
		if (!OPTION_KEYWORDS.has(error.name ?? '') || !error.schemaPath) continue;
		const path = error.schemaPath;
		const scopes = groups.get(path) ?? new Map<string, OptionGroup>();
		groups.set(path, scopes);
		const scope = error.property ?? '';
		let group = scopes.get(scope);
		if (!group) {
			group = { selectors: [], branches: new Map() };
			scopes.set(scope, group);
			const depth = path.split('/').length;
			(levels[depth] ??= []).push(group);
		}
		group.selectors.push(error);
	}
	for (const error of errors) {
		if (!error.schemaPath) continue;
		const scopes: string[] = [];
		for (let scope = error.property ?? ''; scope; scope = scope.slice(0, Math.max(scope.lastIndexOf('.'), scope.lastIndexOf('['), 0))) scopes.push(scope);
		// More specific scopes win; item 1 never borrows item 10's errors.
		scopes.push('');
		const ancestors = [...error.schemaPath.matchAll(/\/(oneOf|anyOf)\/(\d+)(?=\/|$)/g)].reverse();
		for (const match of ancestors) {
			const path = `${error.schemaPath.slice(0, match.index)}/${match[1]}`;
			const byScope = groups.get(path);
			if (!byScope) continue;
			const scope = scopes.find(candidate => byScope.has(candidate));
			if (scope === undefined) continue;
			const group = byScope.get(scope)!;
			const branch: OptionBranch = group.branches.get(match[2]) ?? { errors: [], children: [] };
			if (!group.branches.has(match[2])) group.branches.set(match[2], branch);
			const child = OPTION_KEYWORDS.has(error.name ?? '') ? groups.get(error.schemaPath)?.get(error.property ?? '') : undefined;
			if (child) {
				if (!child.parent) {
					child.parent = branch;
					branch.children.push(child);
				}
			} else branch.errors.push(error);
			break;
		}
	}
	const metadata = new Map<string, OptionMetadata | undefined>();
	for (let depth = levels.length - 1; depth >= 0; depth--) {
		for (const group of levels[depth] ?? []) {
			const path = group.selectors[0].schemaPath!;
			if (!metadata.has(path)) metadata.set(path, optionMetadata(rootSchema, path));
			const info = metadata.get(path);
			// Passing options emit no branch errors, so partial coverage leaves viability unknown.
			if (
				!info ||
				group.branches.size !== info.optionCount ||
				group.selectors.some(error => Array.isArray(error.params?.passingSchemas) && error.params.passingSchemas.length > 1)
			)
				continue;
			const candidates: string[] = [];
			let complete = true;
			for (const [key, branch] of group.branches) {
				const branchIndex = Number(key);
				if (branchIndex >= info.optionCount || String(branchIndex) !== key) {
					complete = false;
					break;
				}
				// A child retains its selector or selected content, so it always contributes an error.
				if ((branch.errors.length || branch.children.length) && !branch.errors.some(error => isDiscriminatorError(error, `${path}/${key}/`, info, rootSchema)))
					candidates.push(key);
			}
			if (!complete || candidates.length !== 1) continue;
			group.dropSelector = true;
			for (const [key, branch] of group.branches) branch.dropped = key !== candidates[0];
		}
	}
	const dropped = new Set<RJSFValidationError>();
	function mark(group: OptionGroup, omitted: boolean): void {
		if (omitted || group.dropSelector) group.selectors.forEach(error => dropped.add(error));
		for (const branch of group.branches.values()) {
			const skip = omitted || !!branch.dropped;
			if (skip) branch.errors.forEach(error => dropped.add(error));
			branch.children.forEach(child => mark(child, skip));
		}
	}
	for (const scopes of groups.values()) for (const group of scopes.values()) if (!group.parent) mark(group, false);
	return dropped.size ? errors.filter(error => !dropped.has(error)) : errors;
}

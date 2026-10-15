import { describe, expect, it } from 'vitest';
import { createSchemaUtils, ErrorSchema, RJSFSchema, RJSFValidationError, toErrorList, validationDataMerge } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { ERROR_SHAPES } from '../test-utils/matrix';
import { humanizeSchemaErrors, pruneOptionErrors, sanitizeExtraErrors } from './errors';

const freeze = <T>(value: T): T => {
	if (value && typeof value === 'object') {
		Object.values(value).forEach(freeze);
		Object.freeze(value);
	}
	return value;
};

const buildError = (overrides: Partial<RJSFValidationError>): RJSFValidationError => ({
	name: 'required',
	message: "must have required property 'CA Certificate'",
	params: {},
	property: '.tls.ca_certificate',
	stack: ".tls.ca_certificate must have required property 'CA Certificate'",
	...overrides
});

describe('humanizeSchemaErrors', () => {
	it('rewrites required errors without repeating the property name', () => {
		const [error] = humanizeSchemaErrors([buildError({})]);
		expect(error.message).toBe('This field is required.');
		expect(error.stack).toBe("'CA Certificate' This field is required.");
	});

	it.each([
		[{ name: 'minLength', params: { limit: 8 } }, 'Must be at least 8 characters.'],
		[{ name: 'minLength', params: { limit: 1 } }, 'Must be at least 1 character.'],
		[{ name: 'maxLength', params: { limit: 10 } }, 'Must be at most 10 characters.'],
		[{ name: 'minimum', params: { limit: 1 } }, 'Must be 1 or more.'],
		[{ name: 'maximum', params: { limit: 65535 } }, 'Must be 65535 or less.'],
		[{ name: 'exclusiveMinimum', params: { limit: 0 } }, 'Must be greater than 0.'],
		[{ name: 'exclusiveMaximum', params: { limit: 100 } }, 'Must be less than 100.'],
		[{ name: 'minItems', params: { limit: 1 } }, 'Must have at least 1 item.'],
		[{ name: 'maxItems', params: { limit: 2 } }, 'Must have at most 2 items.'],
		[{ name: 'minProperties', params: { limit: 1 } }, 'Must have at least 1 property.'],
		[{ name: 'maxProperties', params: { limit: 3 } }, 'Must have at most 3 properties.'],
		[{ name: 'multipleOf', params: { multipleOf: 5 } }, 'Must be a multiple of 5.']
	])('rewrites limit-based errors: %o', (overrides, expected) => {
		const [error] = humanizeSchemaErrors([buildError(overrides)]);
		expect(error.message).toBe(expected);
	});

	it.each([
		[{ name: 'pattern', params: { pattern: '^[a-z]+$' } }, 'Must match the pattern "^[a-z]+$".'],
		[{ name: 'format', params: { format: 'email' } }, 'Must be a valid email.'],
		[{ name: 'type', params: { type: 'integer' } }, 'Must be an integer.'],
		[{ name: 'type', params: { type: 'string' } }, 'Must be a string.'],
		[{ name: 'uniqueItems', params: { i: 1, j: 0 } }, 'Items must be unique.'],
		[{ name: 'enum', params: { allowedValues: ['PLAIN', 'SCRAM-SHA-256'] } }, 'Must be one of: PLAIN, SCRAM-SHA-256.'],
		[{ name: 'enum', params: { allowedValues: ['a', 'b', 'c', 'd', 'e', 'f'] } }, 'Must be one of the allowed values.'],
		[{ name: 'enum', params: { allowedValues: [{ unit: 'm' }, null, 3] } }, 'Must be one of: {"unit":"m"}, null, 3.'],
		[{ name: 'not', params: {} }, "This value isn't allowed."],
		[{ name: 'additionalProperties', params: { additionalProperty: 'tls_version' } }, '"tls_version" isn\'t an allowed property.'],
		[{ name: 'dependencies', params: { property: 'client_key', missingProperty: 'client_cert' } }, '"client_cert" is required when "client_key" is set.'],
		[{ name: 'const', params: { allowedValue: 'a' } }, 'Must be equal to the allowed value.'],
		[{ name: 'oneOf', params: { passingSchemas: null } }, 'Must match exactly one of the allowed options.'],
		[{ name: 'anyOf', params: {} }, 'Does not match any of the allowed options.']
	])('rewrites structural and value errors: %o', (overrides, expected) => {
		const [error] = humanizeSchemaErrors([buildError(overrides)]);
		expect(error.message).toBe(expected);
	});

	it('explains oneOf failures when a value matches multiple options', () => {
		const { errors } = validator.validateFormData(5, { type: 'number', oneOf: [{ minimum: 0 }, { maximum: 10 }] });
		const [error] = humanizeSchemaErrors(errors);

		expect(error.params.passingSchemas).toEqual([0, 1]);
		expect(error.message).toBe('Matches more than one of the allowed options; it must match exactly one.');
	});

	it('falls back to the capitalized message when a type error names no type', () => {
		const [error] = humanizeSchemaErrors([buildError({ name: 'type', params: {}, message: 'must be valid' })]);
		expect(error.message).toBe('Must be valid');
	});

	it('capitalizes messages it has no rewrite for', () => {
		const [error] = humanizeSchemaErrors([buildError({ name: 'if', message: 'must match "then" schema', property: undefined, stack: 'must match "then" schema' })]);
		expect(error.message).toBe('Must match "then" schema');
		expect(error.stack).toBe('Must match "then" schema');
	});

	it('keeps errors without a message untouched', () => {
		const input = buildError({ message: undefined });
		const [error] = humanizeSchemaErrors([input]);
		expect(error).toEqual(input);
	});

	it('keeps array and error identity when no message changes', () => {
		const input = [buildError({ name: 'required', message: 'This field is required.' })];
		const result = humanizeSchemaErrors(input);
		expect(result).toBe(input);
		expect(result[0]).toBe(input[0]);
	});

	it.each([
		{ name: 'schema title', uiSchema: {}, title: 'Broker hostname' },
		{ name: 'UI title', uiSchema: { host: { 'ui:title': "Plant's broker" } }, title: "Plant's broker" }
	])('preserves required and length error titles from the validator: $name', ({ uiSchema, title }) => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			required: ['host'],
			properties: { host: { type: 'string', title: 'Broker hostname', minLength: 5 } }
		});
		for (const data of [{}, { host: 'tcp' }]) {
			const raw = freeze(validator.validateFormData(data, schema, undefined, undefined, uiSchema).errors);
			const [friendly] = humanizeSchemaErrors(raw);
			expect(friendly.message).toBe(friendly.name === 'required' ? 'This field is required.' : 'Must be at least 5 characters.');
			expect(friendly.stack).toBe(`'${title}' ${friendly.message}`);
			expect(friendly.property).toBe(raw[0].property);
			expect(friendly.schemaPath).toBe(raw[0].schemaPath);
			expect(friendly.params).toBe(raw[0].params);
			expect(friendly).not.toBe(raw[0]);
		}
	});

	it('preserves a titled numeric error and an opaque custom stack without mutating frozen inputs', () => {
		const schema: RJSFSchema = freeze({ type: 'integer', title: 'Broker port', minimum: 1 });
		const raw = freeze(validator.validateFormData(0, schema).errors);
		expect(humanizeSchemaErrors(raw)[0].stack).toBe("'Broker port' Must be 1 or more.");
		const custom = freeze([buildError({ name: 'format', params: { format: 'uri' }, message: 'invalid URI', stack: 'Broker address: invalid URI (server detail)' })]);
		expect(humanizeSchemaErrors(custom)[0]).toMatchObject({ message: 'Must be a valid uri.', stack: custom[0].stack });
	});

	it('preserves a required error stack whose format does not contain an AJV title', () => {
		const raw = freeze([buildError({ stack: 'Connection form: missing certificate (request 19)' })]);
		expect(humanizeSchemaErrors(raw)[0]).toMatchObject({ message: 'This field is required.', stack: raw[0].stack });
	});
});

describe('sanitizeExtraErrors', () => {
	it.each(ERROR_SHAPES)('preserves messages and indexes for $name', row => {
		const result = sanitizeExtraErrors(freeze(row.extraErrors));
		const observed = toErrorList(result).map(error => ({
			id: ['root', ...(error.property ?? '').split('.').filter(Boolean)].join('_'),
			message: error.message
		}));
		expect(observed).toEqual(row.messages);
		if (!row.messages.length) expect(result).toBeUndefined();
	});

	it.each([
		undefined,
		null,
		false,
		0,
		'Unavailable',
		{},
		{ port: null },
		{ port: false },
		{ port: 'Unavailable' },
		{ __errors: [] },
		{ __errors: undefined },
		{ __errors: null },
		{ __errors: 'Unavailable' },
		{ __errors: ['Unavailable', 7] },
		{ __errors: Array(1) }
	])('drops invalid and empty trees: %j', input => {
		expect(sanitizeExtraErrors(freeze(input))).toBeUndefined();
	});

	it('drops a whole mixed message list while retaining valid child errors', () => {
		const input = freeze({ __errors: ['Unavailable', null], port: { __errors: ['Port unavailable.'] } });
		expect(sanitizeExtraErrors(input)).toEqual({ port: { __errors: ['Port unavailable.'] } });
	});

	it('preserves a true sparse array index and drops null branches', () => {
		const brokers: unknown[] = [];
		brokers[0] = null;
		brokers[2] = { host: { __errors: ['Broker unreachable.'] } };
		const input = freeze({ brokers });
		expect(sanitizeExtraErrors(input)).toEqual({ brokers: { 2: { host: { __errors: ['Broker unreachable.'] } } } });
		expect(1 in input.brokers).toBe(false);
	});

	it('copies message lists and retains duplicates without changing caller-owned errors', () => {
		const input = freeze({ port: { __errors: ['Port unavailable.', 'Port unavailable.'] } });
		const result = sanitizeExtraErrors<{ port: number }>(input)!;
		expect(result).not.toBe(input);
		expect(result.port).not.toBe(input.port);
		expect(result.port!.__errors).not.toBe(input.port.__errors);
		result.port!.__errors!.push('Port needs configuration.');
		expect(input.port.__errors).toEqual(['Port unavailable.', 'Port unavailable.']);
	});
});

describe('RJSF error merging contracts', () => {
	const schema: RJSFSchema = freeze({
		type: 'object',
		properties: { brokers: { type: 'array', items: { type: 'object', properties: { host: { type: 'string', minLength: 5 } } } } }
	});
	type BrokerData = { brokers: { host: string }[] };

	it('retains identical validator and server errors in both merged error shapes', () => {
		const validation = freeze(validator.validateFormData({ brokers: [{ host: 'tcp' }] }, schema, undefined, humanizeSchemaErrors));
		const message = validation.errors[0].message!;
		expect(message).toBe('Must be at least 5 characters.');
		const extra = freeze(sanitizeExtraErrors<BrokerData>({ brokers: [{ host: { __errors: [message] } }] })!);
		const merged = validationDataMerge<BrokerData>(validation, extra);
		expect(merged.errors.map(({ property, message: text }) => ({ property, message: text }))).toEqual([
			{ property: '.brokers.0.host', message },
			{ property: '.brokers.0.host', message }
		]);
		expect(merged.errorSchema).toEqual({ brokers: { 0: { host: { __errors: [message, message] } } } });
		expect(validation.errors).toHaveLength(1);
		expect(extra.brokers?.[0]?.host?.__errors).toEqual([message]);
	});

	it('keeps a validator item and a sparse server item at their original indexes', () => {
		const validation = freeze(validator.validateFormData({ brokers: [{ host: 'tcp' }, { host: 'broker-2.local' }] }, schema, undefined, humanizeSchemaErrors));
		const raw = freeze({ brokers: [undefined, { host: { __errors: ['Broker unreachable.'] } }] });
		// RJSF skips an array-shaped branch; the boundary conversion makes it visible.
		expect(toErrorList(raw as unknown as ErrorSchema<BrokerData>)).toEqual([]);
		const extra = freeze(sanitizeExtraErrors<BrokerData>(raw)!);
		const merged = validationDataMerge<BrokerData>(validation, extra);
		expect(merged.errorSchema).toEqual({
			brokers: { 0: { host: { __errors: ['Must be at least 5 characters.'] } }, 1: { host: { __errors: ['Broker unreachable.'] } } }
		});
		expect(merged.errors.map(error => error.property)).toEqual(['.brokers.0.host', '.brokers.1.host']);
		expect(raw.brokers[0]).toBeUndefined();
	});

	it('uses the extra tree directly with no validator errors and treats empty server trees as absent', () => {
		const validation = freeze({ errors: [], errorSchema: {} });
		const extra = freeze(sanitizeExtraErrors<BrokerData>({ brokers: { 1: { host: { __errors: ['Broker unreachable.'] } } } })!);
		const merged = validationDataMerge<BrokerData>(validation, extra);
		expect(merged.errorSchema).toBe(extra);
		expect(merged.errors.map(error => error.property)).toEqual(['.brokers.1.host']);
		expect(validationDataMerge(validation, sanitizeExtraErrors({ port: { __errors: [] } }))).toBe(validation);
	});
});

describe('pruneOptionErrors', () => {
	// Shaped like the Kafka exporter's security selector: a hidden `protocol`
	// discriminator per option, and a SASL option with required credentials.
	const securitySchema: RJSFSchema = {
		type: 'object',
		properties: {
			security: {
				type: 'object',
				oneOf: [
					{ title: 'Plaintext', properties: { protocol: { const: 'PLAINTEXT' } }, required: ['protocol'] },
					{
						title: 'SASL',
						properties: {
							protocol: { const: 'SASL_PLAINTEXT' },
							sasl: {
								type: 'object',
								properties: { username: { type: 'string' }, password: { type: 'string' } },
								required: ['username', 'password']
							}
						},
						required: ['protocol', 'sasl']
					}
				]
			}
		}
	};

	const validate = (formData: object) => validator.validateFormData(formData, securitySchema).errors;

	it('drops the oneOf error and discriminator mismatches when the chosen option reports field errors', () => {
		const errors = validate({ security: { protocol: 'SASL_PLAINTEXT', sasl: {} } });
		expect(errors.map(({ name }) => name)).toEqual(expect.arrayContaining(['oneOf', 'const', 'required']));

		const pruned = pruneOptionErrors(errors, securitySchema);

		expect(pruned.map(({ name, property }) => `${name} ${property}`).sort()).toEqual(['required .security.sasl.password', 'required .security.sasl.username']);
	});

	it('still prunes complete failure coverage when the validator omits selector params', () => {
		const raw = freeze(validate({ security: { protocol: 'SASL_PLAINTEXT', sasl: {} } }));
		expect(raw.filter(error => error.name === 'required')).toHaveLength(2);
		const withoutParams = freeze(raw.map(error => (error.name === 'oneOf' ? { ...error, params: undefined } : error)));
		for (const input of [withoutParams, freeze([...withoutParams].reverse())]) {
			expect(pruneOptionErrors(input, securitySchema)).toEqual(input.filter(error => error.name === 'required'));
		}
	});

	it('keeps the oneOf error when no option reports anything but discriminator mismatches', () => {
		const errors = validate({ security: { protocol: 'SSL' } });

		const pruned = pruneOptionErrors(errors, securitySchema);

		expect(pruned).toBe(errors);
		expect(pruned.some(({ name }) => name === 'oneOf')).toBe(true);
	});

	it('leaves unrelated errors and their identity untouched', () => {
		const schema: RJSFSchema = { type: 'object', properties: { name: { type: 'string', minLength: 3 } } };
		const input = [buildError({ name: 'minLength', params: { limit: 3 }, schemaPath: '#/properties/name/minLength' })];

		expect(pruneOptionErrors(input, schema)).toBe(input);
	});

	it('applies the same rule to anyOf', () => {
		const schema: RJSFSchema = {
			type: 'object',
			properties: {
				auth: {
					type: 'object',
					anyOf: [{ properties: { kind: { const: 'token' } } }, { properties: { kind: { const: 'basic' }, user: { type: 'string' } }, required: ['user'] }]
				}
			}
		};
		const { errors } = validator.validateFormData({ auth: { kind: 'basic' } }, schema);

		expect(pruneOptionErrors(errors, schema).map(({ name, property }) => `${name} ${property}`)).toEqual(['required .auth.user']);
	});

	it('keeps everything without the schema, which is the only way to tell which property names an option', () => {
		const errors = validate({ security: { protocol: 'SASL_PLAINTEXT', sasl: {} } });

		expect(pruneOptionErrors(errors)).toBe(errors);
	});

	it("doesn't take a multi-value enum on one option's field for a discriminator", () => {
		// `unit` is declared by both options, but its enum is a choice within option A, not a
		// marker of it; only `kind` tells the options apart
		const schema: RJSFSchema = {
			type: 'object',
			properties: {
				reading: {
					type: 'object',
					oneOf: [
						{ properties: { kind: { const: 'metric' }, unit: { enum: ['m', 'cm'] } }, required: ['kind'] },
						{ properties: { kind: { const: 'imperial' }, unit: { type: 'string' } }, required: ['kind', 'unit'] }
					]
				}
			}
		};
		const { errors } = validator.validateFormData({ reading: { kind: 'metric', unit: 'ft' } }, schema);

		expect(pruneOptionErrors(errors, schema).map(({ name, property }) => `${name} ${property}`)).toEqual(['enum .reading.unit']);
	});
});

describe('pruneOptionErrors with ambiguous field constraints', () => {
	it.each(['oneOf', 'anyOf'] as const)('keeps %s errors when a shared value only has a not constraint', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{
					properties: { kind: { const: 'certificate' }, value: { not: { const: 'bad' } }, certificate: { type: 'string' } },
					required: ['certificate']
				},
				{ properties: { kind: { type: 'string' }, value: { type: 'string' }, host: { type: 'string' } }, required: ['host'] }
			]
		});
		const raw = freeze(validator.validateFormData({ kind: 'certificate', value: 'bad' }, schema).errors);
		expect(raw.map(({ name, property }) => `${name} ${property}`)).toEqual(expect.arrayContaining(['not .value', 'required certificate', 'required host', `${keyword} `]));
		for (const input of [raw, freeze([...raw].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
	});

	it.each(['oneOf', 'anyOf'] as const)('keeps %s errors when one unit enum has multiple values and another pins it', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{ properties: { kind: { const: 'metric' }, unit: { enum: ['m', 'cm'] } } },
				{ properties: { kind: { const: 'imperial' }, unit: { const: 'yd' } } },
				{ properties: { kind: { type: 'string' }, unit: { type: 'string' }, host: { type: 'string' } }, required: ['host'] }
			]
		});
		const raw = freeze(validator.validateFormData({ kind: 'metric', unit: 'ft' }, schema).errors);
		expect(raw.map(({ name, property }) => `${name} ${property}`)).toEqual(expect.arrayContaining(['enum .unit', 'required host', `${keyword} `]));
		for (const input of [raw, freeze([...raw].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
	});
});

describe('pruneOptionErrors with ambiguous root constraints', () => {
	it.each(['oneOf', 'anyOf'] as const)('keeps %s errors when a root not constrains the identified option', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{
					type: 'object',
					properties: { kind: { const: 'password' } },
					not: { properties: { value: { const: 'bad' } }, required: ['value'] },
					required: ['certificate']
				},
				{ type: 'object', properties: { kind: { type: 'string' } }, required: ['host'] }
			]
		});
		const raw = freeze(validator.validateFormData({ kind: 'password', value: 'bad' }, schema).errors);
		expect(raw.map(({ name, property }) => `${name} ${property}`)).toEqual(expect.arrayContaining(['not ', 'required certificate', 'required host', `${keyword} `]));
		for (const input of [raw, freeze([...raw].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
	});

	it.each(['oneOf', 'anyOf'] as const)('keeps %s errors when a root enum contains multiple complete values', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{
					type: 'object',
					properties: { kind: { const: 'metric' } },
					enum: [
						{ kind: 'metric', unit: 'm' },
						{ kind: 'metric', unit: 'cm' }
					]
				},
				{ type: 'object', properties: { kind: { type: 'string' } }, required: ['host'] }
			]
		});
		const raw = freeze(validator.validateFormData({ kind: 'metric', unit: 'ft' }, schema).errors);
		expect(raw.map(({ name, property }) => `${name} ${property}`)).toEqual(expect.arrayContaining(['enum ', 'required host', `${keyword} `]));
		for (const input of [raw, freeze([...raw].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
	});
});

describe('pruneOptionErrors with unrelated pins', () => {
	it.each(['oneOf', 'anyOf'] as const)('keeps %s complex root not errors beside an unrelated root const', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{
					properties: { kind: { const: 'certificate' } },
					not: { properties: { value: { const: 'bad' } }, required: ['value'] },
					required: ['certificate']
				},
				{ properties: { kind: { type: 'string' } }, required: ['host'] },
				{ const: { kind: 'plaintext' }, properties: { kind: { const: 'plaintext' } } }
			]
		});
		const raw = freeze(validator.validateFormData({ kind: 'certificate', value: 'bad' }, schema).errors);
		expect(raw.map(({ name, property }) => `${name} ${property}`)).toEqual(expect.arrayContaining(['not ', 'required certificate', 'required host', `${keyword} `]));
		for (const input of [raw, freeze([...raw].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
	});

	it.each(['oneOf', 'anyOf'] as const)('keeps %s root not errors when their excluded literal differs from the root pin', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{ properties: { kind: { const: 'certificate' } }, not: { const: { kind: 'certificate', value: 'bad' } }, required: ['certificate'] },
				{ properties: { kind: { type: 'string' } }, required: ['host'] },
				{ const: { kind: 'plaintext' }, properties: { kind: { const: 'plaintext' } } }
			]
		});
		const raw = freeze(validator.validateFormData({ kind: 'certificate', value: 'bad' }, schema).errors);
		expect(raw.map(({ name, property }) => `${name} ${property}`)).toEqual(expect.arrayContaining(['not ', 'required certificate', 'required host', `${keyword} `]));
		for (const input of [raw, freeze([...raw].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
	});

	describe.each([
		{ name: 'a different excluded literal', negated: { const: 'bad' } },
		{ name: 'an enum with an unpinned excluded value', negated: { enum: ['yd', 'bad'] } },
		{ name: 'a complex excluded constraint', negated: { minLength: 2 } }
	])('field not with $name', ({ negated }) => {
		it.each(['oneOf', 'anyOf'] as const)('keeps %s errors when a sibling pins an unrelated unit', keyword => {
			const schema: RJSFSchema = freeze({
				type: 'object',
				[keyword]: [
					{ properties: { kind: { const: 'metric' }, unit: { not: negated } }, required: ['certificate'] },
					{ properties: { kind: { const: 'imperial' }, unit: { const: 'yd' } } },
					{ properties: { kind: { type: 'string' }, unit: { type: 'string' } }, required: ['host'] }
				]
			});
			const raw = freeze(validator.validateFormData({ kind: 'metric', unit: 'bad' }, schema).errors);
			expect(raw.map(({ name, property }) => `${name} ${property}`)).toEqual(expect.arrayContaining(['not .unit', 'required certificate', 'required host', `${keyword} `]));
			for (const input of [raw, freeze([...raw].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
		});
	});
});

describe('pruneOptionErrors with positive enum and complement guards', () => {
	it.each(['oneOf', 'anyOf'] as const)('matches %s shared-field complement literals by value', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{ properties: { method: { const: { kind: 'certificate' } } }, required: ['certificate'] },
				{ properties: { method: { const: { kind: 'password' } } }, required: ['password'] },
				{ properties: { method: { not: { enum: [{ kind: 'certificate' }, { kind: 'password' }] } } }, required: ['host'] }
			]
		});
		const raw = freeze(validator.validateFormData({ method: { kind: 'certificate' } }, schema).errors);
		expect(raw.map(({ name }) => name)).toEqual(expect.arrayContaining(['const', 'not', 'required', keyword]));
		const retained = raw.filter(error => error.name === 'required' && error.property === 'certificate');
		expect(retained).toHaveLength(1);
		expect(pruneOptionErrors(raw, schema)).toEqual(retained);
	});

	describe.each([
		{ name: 'const', pin: { const: { certificate: 'ca' } }, complement: { const: { certificate: 'ca' } } },
		{ name: 'singleton enum', pin: { enum: [{ certificate: 'ca' }] }, complement: { enum: [{ certificate: 'ca' }] } }
	])('root object $name complement guards', ({ pin, complement }) => {
		it.each(['oneOf', 'anyOf'] as const)('matches %s separately allocated object literals by value', keyword => {
			const schema: RJSFSchema = freeze({
				type: 'object',
				[keyword]: [{ ...pin, properties: { certificate: { type: 'string', minLength: 3 } } }, { not: complement }]
			});
			const raw = freeze(validator.validateFormData({ certificate: 'ca' }, schema).errors);
			expect(raw.map(({ name }) => name)).toEqual(expect.arrayContaining(['not', 'minLength', keyword]));
			const retained = raw.filter(error => error.name === 'minLength');
			expect(retained).toHaveLength(1);
			expect(pruneOptionErrors(raw, schema)).toEqual(retained);
		});
	});

	it.each(['oneOf', 'anyOf'] as const)('prunes %s singleton field mismatches and their complement', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{ properties: { method: { enum: ['password'] }, password: { type: 'string' } }, required: ['password'] },
				{ properties: { method: { enum: ['certificate'] }, certificate: { type: 'string' } }, required: ['certificate'] },
				{ properties: { method: { not: { enum: ['password', 'certificate'] } }, host: { type: 'string' } }, required: ['host'] }
			]
		});
		const raw = freeze(validator.validateFormData({ method: 'certificate' }, schema).errors);
		expect(raw.map(({ name }) => name)).toEqual(expect.arrayContaining(['enum', 'not', 'required', keyword]));
		const retained = raw.filter(error => error.name === 'required' && error.property === 'certificate');
		expect(retained).toHaveLength(1);
		const withoutEnumParams = freeze(raw.map(error => (error.name === 'enum' ? { ...error, params: undefined } : error)));
		for (const input of [raw, withoutEnumParams]) expect(pruneOptionErrors(input, schema)).toEqual(retained);
	});

	it.each(['oneOf', 'anyOf'] as const)('prunes %s singleton root enum mismatches without requiring validator params', keyword => {
		const schema: RJSFSchema = freeze({ type: 'string', [keyword]: [{ enum: ['TLS'] }, { minLength: 5 }] });
		const raw = freeze(validator.validateFormData('SSL', schema).errors);
		expect(raw.map(({ name }) => name)).toEqual(expect.arrayContaining(['enum', 'minLength', keyword]));
		const retained = raw.filter(error => error.name === 'minLength');
		expect(retained).toHaveLength(1);
		const withoutEnumParams = freeze(raw.map(error => (error.name === 'enum' ? { ...error, params: undefined } : error)));
		for (const input of [raw, withoutEnumParams]) expect(pruneOptionErrors(input, schema)).toEqual(retained);
	});

	describe.each([
		{ name: 'const', pin: { const: 'TLS' } },
		{ name: 'singleton enum', pin: { enum: ['TLS'] } }
	])('root $name complement guards', ({ pin }) => {
		it.each(['oneOf', 'anyOf'] as const)('prunes %s complement noise while retaining the pinned value content error', keyword => {
			const schema: RJSFSchema = freeze({ type: 'string', [keyword]: [{ ...pin, minLength: 4 }, { not: pin }] });
			const raw = freeze(validator.validateFormData('TLS', schema).errors);
			expect(raw.map(({ name }) => name)).toEqual(expect.arrayContaining(['not', 'minLength', keyword]));
			const retained = raw.filter(error => error.name === 'minLength');
			expect(retained).toHaveLength(1);
			expect(pruneOptionErrors(raw, schema)).toEqual(retained);
		});
	});
});

describe('pruneOptionErrors on nested, repeated and referenced options', () => {
	const summarize = (errors: RJSFValidationError[]) => errors.map(({ name, property }) => `${name} ${property}`).sort();

	it('resolves an inner option list first and keeps the outer error when two outer options still qualify', () => {
		const schema: RJSFSchema = {
			type: 'object',
			properties: {
				s: {
					type: 'object',
					oneOf: [
						{
							properties: {
								kind: { const: 'a' },
								auth: {
									type: 'object',
									oneOf: [
										{ properties: { m: { const: 'p' }, pw: { type: 'string' } }, required: ['m', 'pw'] },
										{ properties: { m: { const: 'q' } }, required: ['m'] }
									]
								}
							},
							required: ['kind']
						},
						{ properties: { kind: { type: 'string' }, z: { type: 'string' } }, required: ['kind', 'z'] }
					]
				}
			}
		};
		const { errors } = validator.validateFormData({ s: { kind: 'a', auth: { m: 'p' } } }, schema);

		const input = freeze(errors);
		const frozenSchema = freeze(schema);
		const pruned = summarize(pruneOptionErrors(input, frozenSchema));
		expect(summarize(pruneOptionErrors(freeze([...input].reverse()), frozenSchema))).toEqual(pruned);

		// The real problem stays visible, the inner selector's noise is gone, and the
		// ambiguous outer list keeps its own message rather than guessing.
		expect(pruned).toContain('required .s.auth.pw');
		expect(pruned).not.toContain('oneOf .s.auth');
		expect(pruned).not.toContain('const .s.auth.m');
		expect(pruned).toContain('oneOf .s');
	});

	it('drops nested selected errors when their enclosing option has a discriminator mismatch', () => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			oneOf: [
				{
					properties: {
						protocol: { const: 'TCP' },
						auth: {
							type: 'object',
							oneOf: [
								{ properties: { method: { const: 'password' }, password: { type: 'string' } }, required: ['password'] },
								{ properties: { method: { const: 'certificate' } } }
							]
						}
					}
				},
				{ properties: { protocol: { const: 'TLS' }, host: { type: 'string' } }, required: ['host'] }
			]
		});
		const raw = freeze(validator.validateFormData({ protocol: 'TLS', auth: { method: 'password' } }, schema).errors);
		expect(raw.some(error => error.property === '.auth.password')).toBe(true);
		const retained = raw.filter(error => error.name === 'required' && error.property === 'host');
		expect(retained).toHaveLength(1);
		for (const input of [raw, freeze([...raw].reverse())]) {
			const result = pruneOptionErrors(input, schema);
			expect(result).toEqual(retained);
			expect(result[0]).toBe(retained[0]);
		}
	});

	it("never judges item 1 on item 10's errors", () => {
		const schema: RJSFSchema = {
			type: 'object',
			properties: {
				l: {
					type: 'array',
					items: {
						type: 'object',
						oneOf: [
							{ properties: { kind: { const: 'a' }, x: { type: 'string' } }, required: ['kind', 'x'] },
							{ properties: { kind: { const: 'b' }, y: { type: 'string' } }, required: ['kind', 'y'] }
						]
					}
				}
			}
		};
		const items = Array.from({ length: 11 }, () => ({ kind: 'a', x: 'ok' }));
		// Item 1 picks option a and misses x; item 10 matches neither option
		items[1] = { kind: 'a' } as (typeof items)[number];
		items[10] = { kind: 'c' } as unknown as (typeof items)[number];
		const { errors } = validator.validateFormData({ l: items }, schema);

		const pruned = summarize(pruneOptionErrors(errors, schema));

		expect(pruned).toContain('required .l.1.x');
		expect(pruned).not.toContain('oneOf .l.1');
		expect(pruned).toContain('oneOf .l.10');
	});

	it('prunes a section behind a $ref, as RJSF validates it with the $ref expanded', () => {
		// Pydantic-style: the section lives in $defs and the property points at it
		const schema: RJSFSchema = {
			type: 'object',
			$defs: {
				Security: {
					type: 'object',
					oneOf: [
						{ properties: { protocol: { const: 'PLAINTEXT' } }, required: ['protocol'] },
						{
							properties: { protocol: { const: 'SASL_SSL' }, sasl: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] } },
							required: ['protocol', 'sasl']
						}
					]
				}
			},
			properties: { security: { $ref: '#/$defs/Security' } }
		};
		const formData = { security: { protocol: 'SASL_SSL', sasl: {} } };
		const expanded = createSchemaUtils(validator, schema).retrieveSchema(schema, formData);
		const { errors } = validator.validateFormData(formData, expanded);
		expect(errors.some(({ schemaPath }) => schemaPath?.startsWith('#/properties/security/oneOf'))).toBe(true);

		expect(summarize(pruneOptionErrors(errors, schema))).toEqual(['required .security.sasl.username']);
	});

	it('keeps the keys beside a $ref, as RJSF does when it merges the definition in', () => {
		// The option list sits next to the $ref, not in the definition
		const schema: RJSFSchema = {
			type: 'object',
			definitions: { Base: { type: 'object', title: 'Security' } },
			properties: {
				security: {
					$ref: '#/definitions/Base',
					oneOf: [
						{ properties: { protocol: { const: 'PLAINTEXT' } }, required: ['protocol'] },
						{ properties: { protocol: { const: 'SASL_SSL' }, user: { type: 'string' } }, required: ['protocol', 'user'] }
					]
				}
			}
		};
		const formData = { security: { protocol: 'SASL_SSL' } };
		const expanded = createSchemaUtils(validator, schema).retrieveSchema(schema, formData);
		const { errors } = validator.validateFormData(formData, expanded);

		expect(summarize(pruneOptionErrors(errors, schema))).toEqual(['required .security.user']);
	});

	it('resolves option paths with escaped JSON pointer segments', () => {
		const schema: RJSFSchema = {
			type: 'object',
			properties: {
				'mqtt/broker': {
					type: 'object',
					oneOf: [
						{ properties: { protocol: { const: 'TCP' } }, required: ['protocol'] },
						{ properties: { protocol: { const: 'TLS' }, ca: { type: 'string' } }, required: ['protocol', 'ca'] }
					]
				}
			}
		};
		const { errors } = validator.validateFormData({ 'mqtt/broker': { protocol: 'TLS' } }, schema);
		expect(errors.some(({ schemaPath }) => schemaPath?.includes('mqtt~1broker'))).toBe(true);

		expect(summarize(pruneOptionErrors(errors, schema))).toEqual([expect.stringMatching(/^required .*ca$/)]);
	});

	it('judges each array item on its own errors', () => {
		const schema: RJSFSchema = {
			type: 'object',
			properties: {
				l: {
					type: 'array',
					items: {
						type: 'object',
						oneOf: [
							{ properties: { kind: { const: 'a' }, x: { type: 'string' } }, required: ['kind', 'x'] },
							{ properties: { kind: { type: 'string' }, z: { type: 'string' } }, required: ['kind', 'z'] }
						]
					}
				}
			}
		};
		const { errors } = validator.validateFormData({ l: [{ kind: 'a' }, { kind: 'c' }] }, schema);

		const pruned = summarize(pruneOptionErrors(errors, schema));

		// Item 0 fits both options structurally, so it keeps all of its errors. Item 1's
		// discriminator only fits option 1, so it is pruned on its own errors alone.
		expect(pruned).toEqual(expect.arrayContaining(['oneOf .l.0', 'required .l.0.x', 'required .l.0.z', 'required .l.1.z']));
		expect(pruned).not.toContain('oneOf .l.1');
		expect(pruned).not.toContain('const .l.1.kind');
		expect(pruned).not.toContain('required .l.1.x');
	});

	it.each([
		['every option is a $ref', [{ $ref: '#/definitions/A' }, { $ref: '#/definitions/B' }], { kind: 'b' }],
		// The inline option is picked and misses a field; the $ref option's errors can't be told
		// apart by path, so without the bail-out the inline option would look like the only one
		['options mix inline and $ref', [{ properties: { kind: { const: 'a' }, x: { type: 'string' } }, required: ['kind', 'x'] }, { $ref: '#/definitions/B' }], { kind: 'a' }]
	])('keeps everything when %s', (_label, options, formData) => {
		const schema: RJSFSchema = {
			type: 'object',
			definitions: {
				A: { properties: { kind: { const: 'a' } }, required: ['kind'] },
				B: { properties: { kind: { const: 'b' }, y: { type: 'string' } }, required: ['kind', 'y'] }
			},
			properties: { s: { type: 'object', oneOf: options as RJSFSchema[] } }
		};
		const { errors } = validator.validateFormData({ s: formData }, schema);

		expect(pruneOptionErrors(errors, schema)).toBe(errors);
	});

	it.each(['protocol', 'default', '$ref'])('keeps definition-path errors from a nested reference on property %s', property => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			$defs: { Tcp: { const: 'TCP' }, Certificate: { type: 'string', minLength: 5 } },
			oneOf: [
				{ properties: { [property]: { $ref: '#/$defs/Tcp' }, host: { type: 'string' } }, required: ['host'] },
				{ properties: { [property]: { const: 'TLS' }, certificate: { $ref: '#/$defs/Certificate' } } }
			]
		});
		const raw = freeze(validator.validateFormData({ [property]: 'TLS', certificate: 'x' }, schema).errors);
		expect(raw.map(error => error.schemaPath)).toEqual(['#/oneOf/0/required', '#/$defs/Tcp/const', '#/$defs/Certificate/minLength', '#/oneOf']);
		expect(pruneOptionErrors(raw, schema)).toBe(raw);
	});

	it('allows literal $ref values in option data and a property named $ref', () => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			oneOf: [
				{ properties: { protocol: { const: 'TCP' }, $ref: { type: 'string' } } },
				{
					properties: {
						protocol: { const: 'TLS' },
						$ref: { type: 'string' },
						metadata: { const: { $ref: 'client-certificate' }, default: { $ref: 'client-certificate' } },
						host: { type: 'string', examples: [{ $ref: 'connection-example' }] }
					},
					required: ['host']
				}
			]
		});
		const raw = freeze(validator.validateFormData({ protocol: 'TLS', $ref: 'connection-1', metadata: { $ref: 'client-certificate' } }, schema).errors);
		expect(pruneOptionErrors(raw, schema).map(({ name, property }) => `${name} ${property}`)).toEqual(['required host']);
	});

	it('ignores option errors without a schema path', () => {
		const schema: RJSFSchema = { type: 'object', properties: { s: { type: 'object', oneOf: [{ required: ['x'] }, { required: ['y'] }] } } };
		const input = [buildError({ name: 'oneOf', property: '.s', schemaPath: undefined }), buildError({ name: 'required', property: '.s.y', schemaPath: undefined })];

		expect(pruneOptionErrors(input, schema)).toBe(input);
	});
});

describe('humanizeSchemaErrors with union types', () => {
	it('lists every allowed type', () => {
		const [error] = humanizeSchemaErrors([buildError({ name: 'type', params: { type: ['string', 'null'] } })]);
		expect(error.message).toBe('Must be a string or null.');
	});

	it('picks the article from the first type', () => {
		const [error] = humanizeSchemaErrors([buildError({ name: 'type', params: { type: ['integer', 'string'] } })]);
		expect(error.message).toBe('Must be an integer or string.');
	});
});

describe('pruneOptionErrors with dependencies options', () => {
	// The OPC UA connector's shape: picking a method makes its fields required, and the
	// "anything else" option is a `not` guard rather than a const.
	const schema: RJSFSchema = {
		type: 'object',
		properties: {
			authentication: {
				type: 'object',
				properties: { type: { type: 'string', enum: ['none', 'credentials', 'certificate'] } },
				dependencies: {
					type: {
						oneOf: [
							{
								properties: {
									type: { const: 'credentials' },
									credentials: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] }
								},
								required: ['credentials']
							},
							{ properties: { type: { const: 'certificate' }, certificate: { type: 'string' } }, required: ['certificate'] },
							{ properties: { type: { not: { enum: ['credentials', 'certificate'] } } } }
						]
					}
				}
			}
		}
	};

	it("treats a `not` guard as a discriminator, leaving only the chosen option's missing field", () => {
		const { errors } = validator.validateFormData({ authentication: { type: 'credentials' } }, schema);
		expect(errors.map(({ name }) => name)).toEqual(expect.arrayContaining(['oneOf', 'const', 'not', 'required']));

		const pruned = pruneOptionErrors(errors, schema);

		expect(pruned.map(({ name, property }) => `${name} ${property}`)).toEqual(['required .authentication.credentials']);
	});

	it("keeps a chosen option's field-level `not` error, since only the discriminating property names the option", () => {
		const fieldNotSchema: RJSFSchema = {
			type: 'object',
			oneOf: [{ properties: { kind: { const: 'named' }, name: { type: 'string', not: { const: '' } } } }, { properties: { kind: { const: 'anonymous' } } }]
		};
		const { errors } = validator.validateFormData({ kind: 'named', name: '' }, fieldNotSchema);

		expect(pruneOptionErrors(errors, fieldNotSchema).map(({ name, property }) => `${name} ${property}`)).toEqual(['not .name']);
	});

	it('keeps the oneOf error when some options fail but more than one passes', () => {
		const ambiguousSchema: RJSFSchema = {
			type: 'object',
			properties: { host: { type: 'string' } },
			oneOf: [{ properties: { host: { minLength: 10 } } }, { properties: { host: { maxLength: 8 } } }, { properties: { host: { pattern: '^[a-z]+$' } } }]
		};
		const { errors } = validator.validateFormData({ host: 'abc' }, ambiguousSchema);
		expect(errors.map(({ name }) => name)).toEqual(expect.arrayContaining(['minLength', 'oneOf']));

		expect(pruneOptionErrors(errors, ambiguousSchema)).toBe(errors);
	});

	it("doesn't rule out the picked option over an enum error on one of its own fields", () => {
		// No property tells these options apart, so an enum failing on `mode` says nothing
		// about which option was picked; both still qualify and every error is kept.
		const undiscriminatedSchema: RJSFSchema = {
			type: 'object',
			oneOf: [{ properties: { mode: { type: 'string', enum: ['fast', 'safe'] } }, required: ['host'] }, { required: ['path'] }]
		};
		const { errors } = validator.validateFormData({ mode: 'turbo' }, undiscriminatedSchema);
		expect(errors.map(({ name }) => name)).toEqual(expect.arrayContaining(['enum', 'oneOf']));

		expect(pruneOptionErrors(errors, undiscriminatedSchema)).toBe(errors);
	});
});

describe('pruneOptionErrors with incomplete validator metadata', () => {
	it.each([
		{ name: 'passingSchemas omitted', params: {} },
		{ name: 'selector params omitted', params: undefined },
		{ name: 'passingSchemas null', params: { passingSchemas: null } },
		{ name: 'passingSchemas empty', params: { passingSchemas: [] } }
	])('keeps an ambiguous oneOf selector with $name', ({ params }) => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			properties: { host: { type: 'string' } },
			oneOf: [{ properties: { host: { minLength: 10 } } }, { properties: { host: { maxLength: 8 } } }, { properties: { host: { pattern: '^[a-z]+$' } } }]
		});
		const raw = freeze(validator.validateFormData({ host: 'plant' }, schema).errors);
		expect(raw).toHaveLength(2);
		expect(raw.find(error => error.name === 'oneOf')?.params.passingSchemas).toEqual([1, 2]);
		const incomplete = freeze(raw.map(error => (error.name === 'oneOf' ? { ...error, params } : error)));
		for (const input of [incomplete, freeze([...incomplete].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
	});

	it.each(['oneOf', 'anyOf'] as const)('keeps the %s selector when a validator omits a failed branch', keyword => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			[keyword]: [
				{ properties: { protocol: { const: 'TCP' }, host: { type: 'string' } }, required: ['host'] },
				{ properties: { protocol: { const: 'TLS' }, certificate: { type: 'string' } }, required: ['certificate'] },
				{ properties: { protocol: { const: 'UDP' }, port: { type: 'integer' } }, required: ['port'] }
			]
		});
		const raw = freeze(validator.validateFormData({ protocol: 'TLS' }, schema).errors);
		const retained = raw.filter(error => error.name === 'required' && error.property === 'certificate');
		expect(retained).toHaveLength(1);
		expect(pruneOptionErrors(raw, schema)).toEqual(retained);
		const incomplete = freeze(raw.filter(error => !error.schemaPath?.startsWith(`#/${keyword}/2/`)));
		expect(incomplete).toHaveLength(raw.length - 2);
		for (const input of [incomplete, freeze([...incomplete].reverse())]) expect(pruneOptionErrors(input, schema)).toBe(input);
	});

	it('checks failure coverage independently for complete and ambiguous array items', () => {
		const schema: RJSFSchema = freeze({
			type: 'array',
			items: {
				type: 'object',
				oneOf: [
					{ properties: { kind: { type: 'string' }, host: { type: 'string', minLength: 10 } } },
					{ properties: { kind: { const: 'plaintext' }, host: { type: 'string', maxLength: 8 } } },
					{ properties: { kind: { const: 'plaintext' }, host: { type: 'string', pattern: '^[a-z]+$' } } }
				]
			}
		});
		const raw = freeze(
			validator.validateFormData(
				[
					{ kind: 'secured', host: 'plant' },
					{ kind: 'plaintext', host: 'plant' }
				],
				schema
			).errors
		);
		expect(raw.find(error => error.name === 'oneOf' && error.property === '.0')?.params.passingSchemas).toBeNull();
		expect(raw.find(error => error.name === 'oneOf' && error.property === '.1')?.params.passingSchemas).toEqual([1, 2]);
		const withoutParams = freeze(raw.map(error => (error.name === 'oneOf' ? { ...error, params: undefined } : error)));
		for (const input of [withoutParams, freeze([...withoutParams].reverse())]) {
			const expected = input.filter(error => error.property !== '.0.kind' && !(error.name === 'oneOf' && error.property === '.0'));
			const result = pruneOptionErrors(input, schema);
			expect(result).toEqual(expected);
			expect(result.filter(error => error.name === 'oneOf').map(error => error.property)).toEqual(['.1']);
		}
	});
});

describe('pruneOptionErrors with frozen inputs', () => {
	it('retains the selected field error for every repeated item and its original identity', () => {
		const schema: RJSFSchema = freeze({
			type: 'array',
			items: {
				type: 'object',
				oneOf: [{ properties: { protocol: { const: 'TCP' } } }, { properties: { protocol: { const: 'TLS' }, certificate: { type: 'string' } }, required: ['certificate'] }]
			}
		});
		const raw = freeze(
			validator.validateFormData(
				Array.from({ length: 32 }, () => ({ protocol: 'TLS' })),
				schema
			).errors
		);
		const retained = raw.filter(error => error.name === 'required');
		const result = pruneOptionErrors(raw, schema);
		expect(result).toHaveLength(32);
		expect(result).toEqual(retained);
		for (let index = 0; index < retained.length; index++) expect(result[index]).toBe(retained[index]);
		expect(raw).toHaveLength(96);
	});

	it('decodes slash and tilde escapes in discriminator property names', () => {
		const schema: RJSFSchema = freeze({
			type: 'object',
			oneOf: [
				{ properties: { 'auth/type~v1': { const: 'tcp' } } },
				{ properties: { 'auth/type~v1': { const: 'tls' }, 'certificate': { type: 'string' } }, required: ['certificate'] }
			]
		});
		const raw = freeze(validator.validateFormData({ 'auth/type~v1': 'tls' }, schema).errors);
		expect(pruneOptionErrors(raw, schema).map(({ name, property }) => `${name} ${property}`)).toEqual(['required certificate']);
	});

	it('returns the same frozen list when an option schema path cannot be resolved', () => {
		const schema = freeze({ type: 'object' } as RJSFSchema);
		const raw = freeze([
			buildError({ name: 'required', property: '.security.host', schemaPath: '#/properties/security/oneOf/0/required' }),
			buildError({ name: 'oneOf', property: '.security', schemaPath: '#/properties/security/oneOf' })
		]);
		expect(pruneOptionErrors(raw, schema)).toBe(raw);
	});
});

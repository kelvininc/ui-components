import { describe, expect, it } from 'vitest';
import buildDefaultHelperText, { buildHelperOptions } from './utils';

describe('buildHelperOptions', () => {
	// `formContext` is a single object RJSF hands to every field and widget in the
	// form. `merge(formContext, uiOptions)` (no `{}` target) wrote each field's
	// `ui:*` options straight into it, so one field carrying `ui:dropdownConfig`
	// leaked that config into every other widget and silently broke them.
	describe('when merging a field ui options into the shared form context', () => {
		it('should not mutate the form context', () => {
			const formContext = { componentSize: 'large' };
			const snapshot = structuredClone(formContext);

			buildHelperOptions(formContext, { dropdownConfig: { minWidth: '240px' } });

			expect(formContext).toEqual(snapshot);
		});

		it('should leave the form context object identity untouched', () => {
			const formContext = { componentSize: 'large' };

			const result = buildHelperOptions(formContext, { dropdownConfig: { minWidth: '240px' } });

			expect(result).not.toBe(formContext);
		});

		it('should not add keys to the form context', () => {
			const formContext = { componentSize: 'large' };

			buildHelperOptions(formContext, { dropdownConfig: { minWidth: '240px' }, showDefaultValueHelper: true });

			expect(Object.keys(formContext)).toEqual(['componentSize']);
		});

		it('should not mutate nested form context values', () => {
			const formContext = { dropdownConfig: { zIndex: 9004, maxHeight: '400px' } };

			buildHelperOptions(formContext, { dropdownConfig: { minWidth: '240px' } });

			expect(formContext.dropdownConfig).toEqual({ zIndex: 9004, maxHeight: '400px' });
		});

		it('should keep every field isolated from the previously rendered field', () => {
			const formContext = { componentSize: 'large' };

			buildHelperOptions(formContext, { dropdownConfig: { minWidth: '240px' } });
			const nextField = buildHelperOptions(formContext, { showDefaultValueHelper: true });

			expect(nextField).not.toHaveProperty('dropdownConfig');
		});
	});

	describe('when resolving the returned options', () => {
		it('should merge the form context with the ui options', () => {
			expect(buildHelperOptions({ componentSize: 'large' }, { showDefaultValueHelper: true })).toEqual({
				componentSize: 'large',
				showDefaultValueHelper: true
			});
		});

		it('should let the field ui options win over the form context', () => {
			expect(buildHelperOptions({ showDefaultValueHelper: false }, { showDefaultValueHelper: true })).toEqual({ showDefaultValueHelper: true });
		});

		it('should still drive the default helper text', () => {
			const options = buildHelperOptions({ showDefaultValueHelper: true }, {});

			expect(buildDefaultHelperText(options, 'a')).toBe('Default: a');
		});
	});
});

describe('buildDefaultHelperText', () => {
	const options = { showDefaultValueHelper: true };

	it.each([
		[false, 'Default: No'],
		[true, 'Default: Yes']
	])('should name a boolean default %p by its option label', (value, text) => {
		expect(buildDefaultHelperText(options, value, { type: 'boolean' })).toBe(text);
	});

	it('should use custom boolean labels from the field ui options', () => {
		expect(buildDefaultHelperText(options, false, { type: 'boolean' }, { uiSchema: { 'ui:options': { booleanLabels: { true: 'On', false: 'Off' } } } })).toBe('Default: Off');
	});

	it('should use custom boolean labels from the global ui options', () => {
		expect(buildDefaultHelperText(options, true, { type: 'boolean' }, { globalUiOptions: { booleanLabels: { true: 'On', false: 'Off' } } })).toBe('Default: On');
	});

	// BooleanField reads booleanLabels from getUiOptions(uiSchema, globalUiOptions), so the helper must not take them from formContext either
	it('should ignore boolean labels the field does not read', () => {
		expect(buildDefaultHelperText({ ...options, booleanLabels: { true: 'On', false: 'Off' } }, false, { type: 'boolean' })).toBe('Default: No');
	});

	it('should name a boolean default by its oneOf title, as the field does', () => {
		const schema = {
			type: 'boolean' as const,
			oneOf: [
				{ const: true, title: 'Enabled' },
				{ const: false, title: 'Disabled' }
			]
		};

		expect(buildDefaultHelperText(options, false, schema)).toBe('Default: Disabled');
	});

	it('should name an enum default by its ui:enumNames label', () => {
		expect(buildDefaultHelperText(options, 'info', { type: 'string', enum: ['debug', 'info'] }, { uiSchema: { 'ui:enumNames': ['Debug', 'Info'] } })).toBe('Default: Info');
	});

	it.each([
		[1, 'Default: Low'],
		['1', 'Default: 1']
	])('should only match a numeric enum option of the same type for %p', (value, text) => {
		expect(buildDefaultHelperText(options, value, { type: 'number', enum: [1, 2] }, { uiSchema: { 'ui:enumNames': ['Low', 'High'] } })).toBe(text);
	});

	it.each([
		['a nullable union', { anyOf: [{ type: 'string' as const }, { type: 'null' as const }] }, 'broker.local', 'Default: broker.local'],
		['a number and string union', { anyOf: [{ type: 'number' as const }, { type: 'string' as const }] }, 5, 'Default: 5'],
		[
			'an object oneOf',
			{ type: 'object' as const, oneOf: [{ properties: { host: { type: 'string' as const } } }, { properties: { port: { type: 'number' as const } } }] },
			{ host: 'broker.local' },
			'Default: {"host":"broker.local"}'
		],
		['a boolean oneOf without constants', { type: 'boolean' as const, oneOf: [{ type: 'boolean' as const }] }, true, 'Default: true']
	])('should keep the raw value for %s instead of throwing', (_name, schema, value, text) => {
		expect(buildDefaultHelperText(options, value, schema)).toBe(text);
	});

	it('should show an object default as JSON', () => {
		expect(buildDefaultHelperText(options, { host: 'broker.local', port: 1883 }, { type: 'object' })).toBe('Default: {"host":"broker.local","port":1883}');
	});

	it('should join a multi-select default by its option labels', () => {
		const schema = { type: 'array' as const, uniqueItems: true, items: { type: 'string' as const, enum: ['debug', 'info', 'warning'] } };

		expect(buildDefaultHelperText(options, ['debug', 'info'], schema, { uiSchema: { 'ui:enumNames': ['Debug', 'Info', 'Warning'] } })).toBe('Default: Debug, Info');
	});

	it('should join a multi-select default by its oneOf titles and keep unmatched values raw', () => {
		const schema = {
			type: 'array' as const,
			items: {
				type: 'string' as const,
				oneOf: [
					{ const: 'debug', title: 'Debug' },
					{ const: 'info', title: 'Info' }
				]
			}
		};

		expect(buildDefaultHelperText(options, ['info', 'trace'], schema)).toBe('Default: Info, trace');
	});

	it('should join a plain array default with commas', () => {
		expect(buildDefaultHelperText(options, ['telemetry', 'alarms'], { type: 'array', items: { type: 'string' } })).toBe('Default: telemetry, alarms');
	});

	it('should name an enum default by its option title', () => {
		const schema = {
			type: 'string' as const,
			oneOf: [
				{ const: 'debug', title: 'Debug' },
				{ const: 'info', title: 'Info' }
			]
		};

		expect(buildDefaultHelperText(options, 'info', schema)).toBe('Default: Info');
	});

	it('should keep the raw value when no option matches', () => {
		expect(buildDefaultHelperText(options, 'trace', { type: 'string', enum: ['debug', 'info'] })).toBe('Default: trace');
	});

	it('should keep the configured prefix', () => {
		expect(buildDefaultHelperText({ ...options, defaultValueHelperPrefix: 'Defaults to ' }, 5, { type: 'number' })).toBe('Defaults to 5');
	});
});

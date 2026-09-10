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

			expect(buildDefaultHelperText(options, 'a')).toBe('Default value is: a');
		});
	});
});

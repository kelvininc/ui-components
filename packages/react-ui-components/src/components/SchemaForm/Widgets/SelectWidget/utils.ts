import { asNumber, guessType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import { get, isEmpty, isNil, isString } from 'lodash';
import { EnumOptions, IUIDropdownOptions } from './types';

const numericTypes = ['number', 'integer'];

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 *
 * Each coercion is guarded by the shape it needs rather than trusting `value` to
 * match `schema`: the value is host data, so an array-typed field can hold a scalar
 * left over from a schema that typed it differently. A value the branch cannot
 * coerce falls through and is returned as-is instead of throwing.
 */
export const processValue = (schema: JSONSchema7, value: any) => {
	// "enum" is a reserved word, so only "type" and "items" can be destructured
	const { type, items } = schema;
	const itemsType = get(items, 'type');
	if (value === '' || isNil(value)) {
		return undefined;
	} else if (type === 'array' && Array.isArray(value) && items && isString(itemsType) && numericTypes.includes(itemsType)) {
		return value.map(asNumber);
	} else if (type === 'boolean') {
		return value === true || value === 'true';
	} else if (type === 'number' || type === 'integer') {
		return asNumber(value);
	}

	// If type is undefined, but an enum is present, try and infer the type from
	// the enum values
	if (schema.enum) {
		if (schema.enum.every((x: any) => guessType(x) === 'number')) {
			return asNumber(value);
		} else if (schema.enum.every((x: any) => guessType(x) === 'boolean')) {
			return value === 'true';
		}
	}

	return value;
};

export const getSelectedOptions = (selectedOptionsMap: Record<string, boolean>): string[] => Object.keys(selectedOptionsMap);

/**
 * Maps the selected values onto the map `KvMultiSelectDropdown` expects.
 *
 * Anything that is not an array selects nothing, rather than throwing. The value
 * reaching a multiple select is host data — it can be a scalar left over from a
 * schema that typed the field differently, or restored from a URL — and
 * `processValue` maps `''` and nil to `undefined`. Reducing over any of those threw
 * `TypeError: … .reduce is not a function` and took the whole form down with it.
 * This mirrors what `buildDropdownOptions` below already does for a non-array
 * `options`.
 */
export const buildSelectedOptions = (selectedOptions?: string[] | null): Record<string, boolean> =>
	Array.isArray(selectedOptions)
		? selectedOptions.reduce<Record<string, boolean>>((accumulator, selectOptionKey) => {
				accumulator[selectOptionKey] = true;

				return accumulator;
		  }, {})
		: {};

export const buildDropdownOptions = <S extends StrictRJSFSchema = RJSFSchema>({
	schema,
	options,
	disabledOptions,
	multiSubOptions
}: {
	schema: S;
	options?: EnumOptions;
	disabledOptions?: EnumOptions;
	multiSubOptions?: IUIDropdownOptions;
}): IUIDropdownOptions => {
	if (!isEmpty(multiSubOptions)) {
		return multiSubOptions;
	}

	return Array.isArray(options)
		? options.reduce((acc, { label, value, schema: optionSchema }, index) => {
				const description = optionSchema?.description;
				const disabled = Array.isArray(disabledOptions) && disabledOptions.indexOf(value) != -1;

				acc[value] = { value, label, description, disabled };
				return acc;
		  }, {})
		: {};
};

export const searchDropdownOptions = (term: string, options: IUIDropdownOptions): IUIDropdownOptions => {
	const lowerCaseTerm = term.toLowerCase();
	return Object.keys(options).reduce<IUIDropdownOptions>((accumulator, key) => {
		const option = options[key];
		const lowerCaseLabel = option.label.toLowerCase();

		if (lowerCaseLabel.includes(lowerCaseTerm)) {
			accumulator[key] = option;
		}

		return accumulator;
	}, {});
};

import { asNumber, guessType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import { get, isEmpty, isNil, isString } from 'lodash';
import { EnumOptions, IUIDropdownOptions } from './types';

const numericTypes = ['number', 'integer'];

const enumSchemaHasCustomTitles = (schema: unknown): schema is { 'x-titles': string[] } => {
	if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
		return false;
	}

	return 'x-titles' in schema;
};

/**
 * Retrieves the label for a given schema and index, using custom titles if available.
 *
 * @typeParam S - Schema type extending `StrictRJSFSchema`.
 * @param {Object} params
 * @param {S} params.schema - The schema to retrieve the label from.
 * @param {number} params.index - The index of the label to retrieve.
 * @param {string} params.fallback - The fallback label to use if no custom title is found.
 * @returns {string} The label for the given schema and index.
 */
const getEnumLabel = <S extends StrictRJSFSchema = RJSFSchema>({ schema, index, fallback }: { schema: S; index: number; fallback: string }): string => {
	if (schema.type === 'array' && enumSchemaHasCustomTitles(schema.items)) {
		return schema.items['x-titles'][index] || fallback;
	}

	if (enumSchemaHasCustomTitles(schema)) {
		return schema['x-titles'][index] || fallback;
	}

	return fallback;
};

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
export const processValue = (schema: JSONSchema7, value: any) => {
	// "enum" is a reserved word, so only "type" and "items" can be destructured
	const { type, items } = schema;
	const itemsType = get(items, 'type');
	if (value === '' || isNil(value)) {
		return undefined;
	} else if (type === 'array' && items && isString(itemsType) && numericTypes.includes(itemsType)) {
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

export const buildSelectedOptions = (selectedOptions: string[]): Record<string, boolean> =>
	selectedOptions.reduce<Record<string, boolean>>((accumulator, selectOptionKey) => {
		accumulator[selectOptionKey] = true;

		return accumulator;
	}, {});

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
		? options.reduce((acc, { label: optionLabel, value, schema: optionSchema }, index) => {
				const description = optionSchema?.description;
				const disabled = Array.isArray(disabledOptions) && disabledOptions.indexOf(value) != -1;

				// If the schema has custom titles, use them instead of the enum options
				let label = getEnumLabel({ schema, index, fallback: optionLabel });

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

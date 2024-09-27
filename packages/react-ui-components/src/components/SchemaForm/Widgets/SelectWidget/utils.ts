import { asNumber, guessType } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';
import { get, isString } from 'lodash';
import { EnumOptions, IUIDropdownOptions } from './types';

const numericTypes = ['number', 'integer'];

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
export const processValue = (schema: JSONSchema7, value: any) => {
	// "enum" is a reserved word, so only "type" and "items" can be destructured
	const { type, items } = schema;
	const itemsType = get(items, 'type');
	if (value === '') {
		return undefined;
	} else if (type === 'array' && items && isString(itemsType) && numericTypes.includes(itemsType)) {
		return value.map(asNumber);
	} else if (type === 'boolean') {
		return value === 'true';
	} else if (type === 'number') {
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

export const buildDropdownOptions = (options?: EnumOptions, disabledOptions?: EnumOptions): IUIDropdownOptions =>
	Array.isArray(options)
		? options.reduce((acc, { label, value, schema }) => {
				const description = schema?.description;
				const disabled = Array.isArray(disabledOptions) && disabledOptions.indexOf(value) != -1;
				acc[value] = { value, label, description, disabled };
				return acc;
		  }, {})
		: [];

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

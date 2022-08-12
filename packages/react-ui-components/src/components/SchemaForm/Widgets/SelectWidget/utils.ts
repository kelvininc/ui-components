import { utils } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

const { asNumber, guessType } = utils;
const numericTypes = ['number', 'integer'];

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
export const processValue = (schema: JSONSchema7, value: any) => {
	// "enum" is a reserved word, so only "type" and "items" can be destructured
	const { type, items } = schema;
	if (value === '') {
		return undefined;
	} else if (type === 'array' && items && numericTypes.includes(get(items, 'type'))) {
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

export const getSelectedOptions = (selectedOptionsMap: { [key: string]: boolean }): string[] =>
	Object.keys(selectedOptionsMap).reduce<string[]>((accumulator, selectedOptionsKey) => {
		if (selectedOptionsMap[selectedOptionsKey]) {
			accumulator.push(selectedOptionsKey);
		}

		return accumulator;
	}, []);

import { EnumOptionsType, FormContextType, RJSFSchema, RegistryWidgetsType, StrictRJSFSchema, UiSchema, Widget, isObject, optionsList } from '@rjsf/utils';
import { JSONSchema7Definition, JSONSchema7 } from 'json-schema';
import { DEFAULT_FALSE_LABEL, DEFAULT_TRUE_LABEL } from './config';
import { isBoolean } from 'lodash';

export const getWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	uiSchema: UiSchema<T, S, F> = {},
	widgets: RegistryWidgetsType<T, S, F>
): Widget<T, S, F> => {
	const { RadioWidget, SelectWidget } = widgets;
	const { ['ui:widget']: widgetName = 'radio' } = uiSchema;

	if (widgetName === 'select') {
		return SelectWidget;
	}

	return RadioWidget;
};

export const isJsonSchema = (value: JSONSchema7Definition): value is JSONSchema7 => isObject(value);

export const getEnumOptions = <S extends StrictRJSFSchema = RJSFSchema>(schema: S): EnumOptionsType<S>[] | undefined => {
	if (Array.isArray(schema.oneOf)) {
		return optionsList<S>({
			oneOf: schema.oneOf.reduce<S[]>((accumulator, option) => {
				if (isJsonSchema(option)) {
					accumulator.push({
						...option,
						title: option.title || (option.const === true ? DEFAULT_TRUE_LABEL : DEFAULT_FALSE_LABEL)
					} as S);
				}

				return accumulator;
			}, [])
		} as unknown as S);
	}

	const enums = schema.enum ?? [true, false];
	if (enums.length === 2 && enums.every(isBoolean)) {
		return [
			{
				value: enums[0],
				label: enums[0] ? DEFAULT_TRUE_LABEL : DEFAULT_FALSE_LABEL
			},
			{
				value: enums[1],
				label: enums[1] ? DEFAULT_TRUE_LABEL : DEFAULT_FALSE_LABEL
			}
		];
	}

	return;
};

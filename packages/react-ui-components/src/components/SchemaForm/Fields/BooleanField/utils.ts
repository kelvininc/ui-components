import { EnumOptionsType, FormContextType, RJSFSchema, RegistryWidgetsType, StrictRJSFSchema, UiSchema, Widget, isObject, optionsList } from '@rjsf/utils';
import { JSONSchema7Definition, JSONSchema7 } from 'json-schema';
import { isBoolean } from 'lodash';

export const getWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	uiSchema: UiSchema<T, S, F> = {},
	widgets: RegistryWidgetsType<T, S, F>
): Widget<T, S, F> => {
	const { RadioWidget, SelectWidget } = widgets;
	const { ['ui:widget']: widgetName = 'radio' } = uiSchema;

	if (widgetName === 'radio') {
		return RadioWidget;
	} else if (widgetName === 'select') {
		return SelectWidget;
	} else if (typeof widgetName === 'string') {
		return widgets[widgetName] ?? RadioWidget;
	}

	return typeof widgetName === 'string' ? widgets[widgetName] : widgetName;
};

export const isJsonSchema = (value: JSONSchema7Definition): value is JSONSchema7 => isObject(value);

export const getEnumOptions = <S extends StrictRJSFSchema = RJSFSchema>(schema: S, booleanLabels: Record<string, string>): EnumOptionsType<S>[] | undefined => {
	if (Array.isArray(schema.oneOf)) {
		return optionsList<S>({
			oneOf: schema.oneOf.reduce<S[]>((accumulator, option) => {
				if (isJsonSchema(option)) {
					accumulator.push({
						...option,
						title: option.title || booleanLabels[(!!option?.const).toString()]
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
				label: booleanLabels[(!!enums[0]).toString()]
			},
			{
				value: enums[1],
				label: booleanLabels[(!!enums[1]).toString()]
			}
		];
	}

	return;
};

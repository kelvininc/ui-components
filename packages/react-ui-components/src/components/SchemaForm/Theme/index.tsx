import { ThemeProps } from '@rjsf/core';
import { FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { generateWidgets } from '../Widgets';
import { generateTemplates } from '../Templates';
import { generateFields } from '../Fields';

export function generateTheme<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(): ThemeProps<T, S, F> {
	return {
		fields: generateFields(),
		templates: generateTemplates(),
		widgets: generateWidgets()
	};
}

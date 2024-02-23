import RadioWidget from './RadioWidget';
import SelectWidget from './SelectWidget';
import CheckboxesWidget from './CheckboxesWidget';
import ReadOnlyValueWidget from './ReadOnlyValueWidget';
import EmailWidget from './EmailWidget';
import DateTimeWidget from './DateTimeWidget';
import DateWidget from './DateWidget';
import TextareaWidget from './TextareaWidget';
import FileWidget from './FileWidget';

import { StrictRJSFSchema, RJSFSchema, FormContextType, RegistryWidgetsType } from '@rjsf/utils';
import RadioListWidget from './RadioListWidget';

export function generateWidgets<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(): RegistryWidgetsType<T, S, F> {
	return {
		RadioWidget,
		RadioListWidget,
		SelectWidget,
		CheckboxesWidget,
		readOnlyValue: ReadOnlyValueWidget,
		ReadOnlyValueWidget,
		EmailWidget,
		DateTimeWidget,
		DateWidget,
		TextareaWidget,
		FileWidget
	};
}
export default generateWidgets();

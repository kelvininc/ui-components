import { StrictRJSFSchema, RJSFSchema, FormContextType, RegistryFieldsType } from '@rjsf/utils';
import BooleanField from './BooleanField/BooleanField';
import { OneOfField, AnyOfField } from './OptionsField';
import { generateSchemaField } from '../rjsf/SchemaField';

export function generateFields<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(): RegistryFieldsType<T, S, F> {
	return {
		BooleanField,
		OneOfField,
		AnyOfField,
		SchemaField: generateSchemaField<T, S, F>()
	};
}
export default generateFields();

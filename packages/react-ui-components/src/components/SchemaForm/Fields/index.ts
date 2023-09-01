import { StrictRJSFSchema, RJSFSchema, FormContextType, RegistryFieldsType } from '@rjsf/utils';
import BooleanField from './BooleanField/BooleanField';

export function generateFields<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(): RegistryFieldsType<T, S, F> {
	return {
		BooleanField
	};
}
export default generateFields();

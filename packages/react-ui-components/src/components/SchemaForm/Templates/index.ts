import DescriptionFieldTemplate from './DescriptionFieldTemplate';
import TitleFieldTemplate from './TitleFieldTemplate';
import ArrayFieldItemTemplate from './ArrayFieldItemTemplate';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import BaseInputTemplate from './BaseInputTemplate';
import ErrorListTemplate from './ErrorListTemplate';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import SubmitButton from './SubmitButton';
import WrapIfAdditionalTemplate from './WrapIfAdditionalTemplate';
import { StrictRJSFSchema, RJSFSchema, FormContextType, TemplatesType } from '@rjsf/utils';

export function generateTemplates<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(): Partial<TemplatesType<T, S, F>> {
	return {
		FieldTemplate,
		ObjectFieldTemplate,
		BaseInputTemplate,
		ArrayFieldTemplate,
		ArrayFieldItemTemplate,
		ErrorListTemplate,
		WrapIfAdditionalTemplate,
		DescriptionFieldTemplate,
		TitleFieldTemplate,
		ButtonTemplates: {
			SubmitButton
		} as any // TODO
	};
}

export default generateTemplates();

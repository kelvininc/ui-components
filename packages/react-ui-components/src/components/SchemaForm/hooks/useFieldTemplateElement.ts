import { useEffect, useState } from 'react';
import Form from '@rjsf/core';
import { StrictRJSFSchema, RJSFSchema, FormContextType } from '@rjsf/utils';

export const useFieldTemplateElement = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	formRef: React.RefObject<Form<T, S, F>>
): HTMLDivElement | undefined => {
	const [fieldTemplate, setFieldTemplate] = useState<HTMLDivElement | undefined>(undefined);

	useEffect(() => {
		if (formRef?.current?.formElement?.current) {
			setFieldTemplate(formRef.current.formElement.current.querySelector('[class^="FieldTemplate"]') as HTMLDivElement);
			return;
		}
		setFieldTemplate(undefined);
	}, [formRef?.current?.formElement?.current]);

	return fieldTemplate;
};

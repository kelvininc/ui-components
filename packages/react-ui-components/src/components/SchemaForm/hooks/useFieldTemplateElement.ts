import { useEffect, useState } from 'react';
import Form from '@rjsf/core';
import { StrictRJSFSchema, RJSFSchema, FormContextType } from '@rjsf/utils';

export const useFieldTemplateElement = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	formRef: React.RefObject<Form<T, S, F>>
): HTMLDivElement | undefined => {
	const [fieldTemplate, setFieldTemplate] = useState<HTMLDivElement | undefined>(undefined);

	useEffect(() => {
		const formElement = formRef.current?.formElement.current as HTMLFormElement | undefined;
		const owned = formElement?.querySelector<HTMLDivElement>('[data-schema-form-field]') ?? undefined;
		setFieldTemplate(current => (current === owned ? current : owned));
	});

	return fieldTemplate;
};

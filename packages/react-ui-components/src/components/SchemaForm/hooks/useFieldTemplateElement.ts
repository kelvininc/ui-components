import { useEffect, useState } from 'react';
import Form from '@rjsf/core';

export const useFieldTemplateElement = <T>(formRef: React.RefObject<Form<T>>): HTMLDivElement | undefined => {
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

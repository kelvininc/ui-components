import { useEffect, useState } from 'react';
import { SchemaForm } from '../SchemaForm';

export const useFieldTemplateElement = <T>(formRef: React.RefObject<SchemaForm<T>>): HTMLDivElement | undefined => {
	const [fieldTemplate, setFieldTemplate] = useState<HTMLDivElement | undefined>(undefined);

	useEffect(() => {
		if (formRef?.current?.formElement) {
			setFieldTemplate(formRef.current.formElement.querySelector('[class^="FieldTemplate"]') as HTMLDivElement);
			return;
		}
		setFieldTemplate(undefined);
	}, [formRef?.current]);

	return fieldTemplate;
};

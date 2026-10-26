import { createContext, useContext } from 'react';

export const FieldDescriptionContext = createContext<{ fieldId: string; elements: readonly Element[] } | null>(null);

export const useFieldDescription = (fieldId: string) => {
	const description = useContext(FieldDescriptionContext);
	return description?.fieldId === fieldId ? description.elements : undefined;
};

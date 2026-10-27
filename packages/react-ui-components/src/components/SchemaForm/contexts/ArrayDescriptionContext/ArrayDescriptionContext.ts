import { createContext, useContext } from 'react';

export interface ArrayDescriptionContextValue {
	fieldId: string;
	fieldTemplate: unknown;
	descriptionId?: string;
}
export const ArrayDescriptionContext = createContext<ArrayDescriptionContextValue | undefined>(undefined);
export const useArrayDescription = () => useContext(ArrayDescriptionContext);

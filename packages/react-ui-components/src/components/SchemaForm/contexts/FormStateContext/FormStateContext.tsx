import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { isEqual, get } from 'lodash';
import { FieldState } from './types';

const FormStateContext = createContext<FormStateContextValue | null>(null);

export interface FormStateContextValue {
	fieldStates: Record<string, FieldState>;
	trackField: (fieldId: string, value: any) => void;
	isFieldTouched: (fieldId: string) => boolean;
	isFieldDirty: (fieldId: string, currentValue: any) => boolean;
	resetFieldState: (fieldId: string) => void;
	resetAllFieldStates: () => void;
}

export interface FormStateProviderProps {
	children: React.ReactNode;
	initialFormData?: any;
}

export const FormStateProvider: React.FC<FormStateProviderProps> = ({ children, initialFormData }) => {
	const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({});
	const [initialData] = useState(initialFormData ?? {});

	const trackField = useCallback(
		(fieldId: string, value: any) => {
			// Get initial value from initialData using field path
			const initialValue = get(initialData, fieldId);
			const hasChanged = !isEqual(value, initialValue);

			setFieldStates(prev => ({
				...prev,
				[fieldId]: {
					touched: true,
					dirty: hasChanged
				}
			}));
		},
		[initialData]
	);

	const isFieldTouched = useCallback(
		(fieldId: string) => {
			return fieldStates[fieldId]?.touched ?? false;
		},
		[fieldStates]
	);

	const isFieldDirty = useCallback(
		(fieldId: string) => {
			return fieldStates[fieldId]?.dirty ?? false;
		},
		[fieldStates]
	);

	const resetFieldState = useCallback((fieldId: string) => {
		setFieldStates(prev => {
			const newState = { ...prev };
			delete newState[fieldId];
			return newState;
		});
	}, []);

	const resetAllFieldStates = useCallback(() => {
		setFieldStates({});
	}, []);

	const value = useMemo(
		() => ({
			fieldStates,
			trackField,
			isFieldTouched,
			isFieldDirty,
			resetFieldState,
			resetAllFieldStates
		}),
		[fieldStates, trackField, isFieldTouched, isFieldDirty, resetFieldState, resetAllFieldStates]
	);

	return <FormStateContext.Provider value={value}>{children}</FormStateContext.Provider>;
};

export const useFormState = (): FormStateContextValue => {
	const context = useContext(FormStateContext);
	if (!context) {
		throw new Error('useFormState must be used within a FormStateProvider');
	}
	return context;
};

import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { isEqual, get } from 'lodash';
import { FieldState } from './types';

const FormStateContext = createContext<FormStateContextValue | null>(null);
export const ParentFieldIdContext = createContext<string | undefined>(undefined);

export interface FormStateContextValue {
	fieldStates: Record<string, FieldState>;
	markFieldAsTouched: (fieldId: string) => void;
	trackFieldChange: (fieldId: string, value: any) => void;
	isFieldTouched: (fieldId: string) => boolean;
	isFieldOrNestedTouched: (fieldId: string) => boolean;
	registerField: (fieldId: string, parentId?: string) => () => void;
	isFieldDirty: (fieldId: string, currentValue: any) => boolean;
	resetFieldState: (fieldId: string) => void;
	resetAllFieldStates: () => void;
	displayErrors: boolean;
	valueResetKey?: number;
}

export interface FormStateProviderProps {
	initialFormData?: any;
	displayErrors?: boolean;
	resetKey?: number;
	valueResetKey?: number;
}

export const FormStateProvider = ({ children, initialFormData, displayErrors = false, resetKey, valueResetKey = resetKey }: PropsWithChildren<FormStateProviderProps>) => {
	const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({});
	const [initialData] = useState(initialFormData ?? {});
	const [parents, setParents] = useState<Record<string, { parentId?: string; count: number }>>({});
	const [previousResetKey, setPreviousResetKey] = useState(resetKey);
	if (previousResetKey !== resetKey) {
		setPreviousResetKey(resetKey);
		setFieldStates({});
	}
	const registerField = useCallback((fieldId: string, parentId?: string) => {
		if (fieldId === parentId) return () => {};
		setParents(prev => ({ ...prev, [fieldId]: { parentId, count: (prev[fieldId]?.parentId === parentId ? prev[fieldId]?.count ?? 0 : 0) + 1 } }));
		return () =>
			setParents(prev => {
				if (!prev[fieldId] || prev[fieldId].parentId !== parentId) return prev;
				if (prev[fieldId].count > 1) return { ...prev, [fieldId]: { parentId, count: prev[fieldId].count - 1 } };
				const next = { ...prev };
				delete next[fieldId];
				return next;
			});
	}, []);

	const markFieldAsTouched = useCallback((fieldId: string) => {
		setFieldStates(prev =>
			prev[fieldId]?.touched
				? prev
				: {
						...prev,
						[fieldId]: {
							...prev[fieldId],
							touched: true
						}
				  }
		);
	}, []);
	const touchedWithAncestors = useMemo(() => {
		const touched = new Set<string>();
		Object.entries(fieldStates).forEach(([id, state]) => {
			for (let current: string | undefined = state.touched ? id : undefined; current && !touched.has(current); ) {
				touched.add(current);
				const owner = current.replace(/__(oneof|anyof)_select$/, '');
				current = Object.prototype.hasOwnProperty.call(parents, current) ? parents[current].parentId : owner !== current ? owner : undefined;
			}
		});
		return touched;
	}, [fieldStates, parents]);
	const isFieldOrNestedTouched = useCallback((fieldId: string) => touchedWithAncestors.has(fieldId), [touchedWithAncestors]);

	const trackFieldChange = useCallback(
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
			markFieldAsTouched,
			trackFieldChange,
			isFieldTouched,
			isFieldOrNestedTouched,
			registerField,
			isFieldDirty,
			resetFieldState,
			resetAllFieldStates,
			displayErrors,
			valueResetKey
		}),
		[
			fieldStates,
			markFieldAsTouched,
			trackFieldChange,
			isFieldTouched,
			isFieldOrNestedTouched,
			registerField,
			isFieldDirty,
			resetFieldState,
			resetAllFieldStates,
			displayErrors,
			valueResetKey
		]
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

export const useFieldErrors = (fieldId: string, rawErrors: unknown[] = []): boolean => {
	const { isFieldOrNestedTouched, displayErrors } = useFormState();
	return (isFieldOrNestedTouched(fieldId) || displayErrors) && rawErrors.length > 0;
};

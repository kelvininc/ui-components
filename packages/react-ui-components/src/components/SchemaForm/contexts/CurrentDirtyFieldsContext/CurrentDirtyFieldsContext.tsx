import { Context, FunctionComponent, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { ICurrentDirtyFieldsContextValues } from './types';
import { SchemaFormContext, SchemaFormProps } from '../../types';
import { RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React from 'react';

export const CurrentFormStateContext: Context<null | ICurrentDirtyFieldsContextValues> = createContext<null | ICurrentDirtyFieldsContextValues>(null);

export const useCurrentDirtyFieldsContext = (): ICurrentDirtyFieldsContextValues => {
	const context = useContext(CurrentFormStateContext);

	if (!context) {
		throw new Error('Missing current dirty fields context');
	}

	return context;
};

export const CurrentDirtyFieldsContextProvider = ({ children, initialDirtyFields }: PropsWithChildren<{ initialDirtyFields?: string[] }>) => {
	const [currentDirtyFields, setCurrentDirtyFields] = useState<string[]>(initialDirtyFields ?? []);

	const isDirty = useCallback(
		(field: string) => {
			return !!currentDirtyFields.find((dirtyField: string) => dirtyField === field);
		},
		[currentDirtyFields]
	);

	const setDirty = useCallback(
		(field: string) => {
			if (!isDirty(field)) {
				setCurrentDirtyFields((prevDirtyFields: string[]) => [...prevDirtyFields, field]);
			}
		},
		[isDirty, setCurrentDirtyFields]
	);

	useEffect(() => {
		console.log('CurrentDirtyFieldsContextProvider: initialDirtyFields', initialDirtyFields);
		if (initialDirtyFields) {
			setCurrentDirtyFields(initialDirtyFields);
		}
	}, [initialDirtyFields]);

	return <CurrentFormStateContext.Provider value={{ isDirty, setDirty }}>{children}</CurrentFormStateContext.Provider>;
};

export const withCurrentDirtyFieldsContextProvider = <T, S extends StrictRJSFSchema = RJSFSchema>(Component: FunctionComponent<SchemaFormProps<T, S, SchemaFormContext>>) => {
	return function CurrentStepContextProviderWrapper(componentProps: PropsWithChildren<SchemaFormProps<T, S, SchemaFormContext>>) {
		return (
			<CurrentDirtyFieldsContextProvider initialDirtyFields={componentProps.formContext?.dirtyFields}>
				<Component {...componentProps} />
			</CurrentDirtyFieldsContextProvider>
		);
	};
};

import Form, { FormProps, ThemeProps } from '@rjsf/core';
import { FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React, { ComponentType, ForwardedRef, forwardRef } from 'react';
import GuardedForm from './Form';

/** Mirrors RJSF 5.24.13 withTheme, using the internal guarded Form. */
export default function withTheme<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	themeProps: ThemeProps<T, S, F>
): ComponentType<FormProps<T, S, F>> {
	return forwardRef(function ThemedForm({ fields, widgets, templates, ...directProps }: FormProps<T, S, F>, ref: ForwardedRef<Form<T, S, F>>) {
		return (
			<GuardedForm<T, S, F>
				{...themeProps}
				{...directProps}
				fields={{ ...themeProps?.fields, ...fields }}
				widgets={{ ...themeProps?.widgets, ...widgets }}
				templates={{
					...themeProps?.templates,
					...templates,
					ButtonTemplates: { ...themeProps?.templates?.ButtonTemplates, ...templates?.ButtonTemplates }
				}}
				ref={ref}
			/>
		);
	});
}

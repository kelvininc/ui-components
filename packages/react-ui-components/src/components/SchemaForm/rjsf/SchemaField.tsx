import { getDefaultRegistry } from '@rjsf/core';
import { FieldProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { ComponentClass } from 'react';
import { areSettingsEqual } from './merge';

/** RJSF 5's SchemaField render, with component-aware props equality; see the contract test. */
export const generateSchemaField = <T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>() => {
	const DefaultSchemaField = getDefaultRegistry<T, S, F>().fields.SchemaField as ComponentClass<FieldProps<T, S, F>>;
	return class SchemaField extends DefaultSchemaField {
		shouldComponentUpdate(nextProps: FieldProps<T, S, F>): boolean {
			return !areSettingsEqual(this.props, nextProps);
		}
	};
};

import { getDefaultRegistry } from '@rjsf/core';
import { allowAdditionalItems, FieldProps, FormContextType, getUiOptions, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React from 'react';
import { ArrayItemLayoutContext, FileArrayErrorsContext } from '../../contexts';

const ArrayField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldProps<T, S, F>) => {
	const DefaultArrayField = getDefaultRegistry<T, S, F>().fields.ArrayField;
	const options = getUiOptions(props.uiSchema, props.registry.globalUiOptions);
	const fixedItems = Array.isArray(props.schema.items) ? props.schema.items.length : 0;
	const layout = {
		itemPrefix: typeof options.itemPrefix === 'string' && options.itemPrefix.trim() ? options.itemPrefix : undefined,
		fixedItems,
		orderable: options.orderable !== false,
		removable: options.removable !== false,
		reserveGrip: options.orderable !== false && (!fixedItems || allowAdditionalItems(props.schema))
	};
	return (
		<FileArrayErrorsContext.Provider value={{ fieldId: props.idSchema.$id, errorSchema: props.hideError ? undefined : props.errorSchema }}>
			<ArrayItemLayoutContext.Provider value={layout}>
				<DefaultArrayField {...props} />
			</ArrayItemLayoutContext.Provider>
		</FileArrayErrorsContext.Provider>
	);
};

export default ArrayField;

import React from 'react';
import { EInputFieldType } from '@kelvininc/ui-components';
import { FormContextType, getTemplate, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';

export default function EmailWidget<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: WidgetProps<T, S, F>) {
	const { options, registry } = props;
	const BaseInputTemplate = getTemplate<'BaseInputTemplate', T, S, F>('BaseInputTemplate', registry, options);

	return <BaseInputTemplate {...props} type={EInputFieldType.Email} />;
}

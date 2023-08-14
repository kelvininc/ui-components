import { EInputFieldType } from '@kelvininc/ui-components';
import { FormContextType, getTemplate, localToUTC, RJSFSchema, StrictRJSFSchema, utcToLocal, WidgetProps } from '@rjsf/utils';
import React, { useCallback } from 'react';

export default function DateTimeWidget<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: WidgetProps<T, S, F>) {
	const { options, registry } = props;
	const BaseInputTemplate = getTemplate<'BaseInputTemplate', T, S, F>('BaseInputTemplate', registry, options);

	const value = utcToLocal(props.value);
	const onChange = useCallback((value: any) => props.onChange(localToUTC(value)), [props.onChange]);
	return <BaseInputTemplate {...props} value={value} onChange={onChange} type={EInputFieldType.DateTime} />;
}

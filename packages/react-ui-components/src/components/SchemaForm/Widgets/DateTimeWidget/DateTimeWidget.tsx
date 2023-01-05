import { EInputFieldType } from '@kelvininc/ui-components';
import { getTemplate, localToUTC, utcToLocal, WidgetProps } from '@rjsf/utils';
import React, { useCallback } from 'react';

export default function DateTimeWidget(props: WidgetProps) {
	const { options, registry } = props;
	const BaseInputTemplate = getTemplate<'BaseInputTemplate'>('BaseInputTemplate', registry, options);

	const value = utcToLocal(props.value);
	const onChange = useCallback((value: any) => props.onChange(localToUTC(value)), [props.onChange]);
	return <BaseInputTemplate {...props} value={value} onChange={onChange} type={EInputFieldType.DateTime} />;
}

import React from 'react';
import { EInputFieldType } from '@kelvininc/ui-components';
import { getTemplate, WidgetProps } from '@rjsf/utils';

export default function DateWidget(props: WidgetProps) {
	const { options, registry } = props;
	const BaseInputTemplate = getTemplate<'BaseInputTemplate'>('BaseInputTemplate', registry, options);

	return <BaseInputTemplate {...props} type={EInputFieldType.Date} />;
}

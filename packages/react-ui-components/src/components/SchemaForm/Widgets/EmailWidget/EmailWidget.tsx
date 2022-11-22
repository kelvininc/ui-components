import React from 'react';
import { EInputFieldType } from '@kelvininc/ui-components';
import BaseInput from '../BaseInput';
import { WidgetProps } from '@rjsf/core';

export default function EmailWidget(props: WidgetProps) {
	return <BaseInput {...props} type={EInputFieldType.Email} />;
}

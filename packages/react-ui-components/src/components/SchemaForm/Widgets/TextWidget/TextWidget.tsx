import { WidgetProps } from '@rjsf/core';
import React from 'react';
import BaseInput from '../BaseInput';

export default function TextWidget(props: WidgetProps) {
	return <BaseInput {...props} />;
}

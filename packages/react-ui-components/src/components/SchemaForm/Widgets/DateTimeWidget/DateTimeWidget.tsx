import React from 'react';
import { WidgetProps, utils } from '@rjsf/core';
import { EInputFieldType } from '@kelvininc/ui-components';
import BaseInput from '../BaseInput';

const { localToUTC, utcToLocal } = utils;
export default function DateTimeWidget(props: WidgetProps) {
	const value = utcToLocal(props.value);
	const onChange = (value: any) => props.onChange(localToUTC(value));

	return <BaseInput {...props} value={value} onChange={onChange} type={EInputFieldType.DateTime} />;
}

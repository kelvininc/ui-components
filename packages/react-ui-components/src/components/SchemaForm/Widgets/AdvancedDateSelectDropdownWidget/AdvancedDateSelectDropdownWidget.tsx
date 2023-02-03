import { ICalendarAdvanceSelectedTime, ITimeChange } from '@kelvininc/ui-components';
import { WidgetProps } from '@rjsf/utils';
import { get } from 'lodash';
import React, { useMemo, useState } from 'react';
import { KvAdvancedDateSelectDropdown, KvFormLabel } from '../../../stencil-generated';
import { DEFAULT_DROPDOWN_POSITION_OPTIONS } from './config';
import { getDefaultTimezone } from './utils';

const AdvancedDateSelectDropdownWidget = ({ schema, label, id, disabled, required, onChange, uiSchema }: WidgetProps) => {
	const { inputConfig, selectedTime, absoluteTimeConfig, relativeTimeConfig, selectedTimezone = getDefaultTimezone(), dateMask } = schema;

	const config = useMemo(
		() => ({
			...inputConfig,
			disabled: inputConfig?.['disabled'] ?? disabled
		}),
		[inputConfig, disabled]
	);

	const [selecetedDateTime, setSelectedDateTime] = useState<ICalendarAdvanceSelectedTime>(selectedTime);

	const onTimeApplied = ({ detail: newTimeState }: CustomEvent<ITimeChange>) => {
		setSelectedDateTime({
			type: newTimeState.time.type,
			key: newTimeState.time.payload?.key
		});
		onChange(newTimeState);
	};

	return (
		<>
			{(get(uiSchema, ['ui:title']) || schema.title || label) && (
				<KvFormLabel id={`${id}-title`} label={get(uiSchema, ['ui:title']) || schema.title || label} required={required} />
			)}
			<KvAdvancedDateSelectDropdown
				selectedTime={selecetedDateTime}
				relativeTimeConfig={relativeTimeConfig}
				selectedTimezone={selectedTimezone}
				dateMask={dateMask}
				onTimeApplied={onTimeApplied}
				dropdownPositionOptions={get(uiSchema, ['ui:dropdownPositionOptions']) || DEFAULT_DROPDOWN_POSITION_OPTIONS}
				absoluteTimeConfig={absoluteTimeConfig}
				inputConfig={config}
			/>
		</>
	);
};

export default AdvancedDateSelectDropdownWidget;

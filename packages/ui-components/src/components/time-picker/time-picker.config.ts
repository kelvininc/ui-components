import { ComputePositionConfig, offset, size, MiddlewareState } from '@floating-ui/dom';
import { EIconName } from '../icon/icon.types';
import { EInputFieldType, EValidationState, ITextField } from '../text-field/text-field.types';
import { DEFAULT_DROPDOWN_Z_INDEX } from '../../globals/config';
import { ITimezoneOffset } from '../../types';

// It needs to be lower because there are other dropdowns with a portal inside
export const TIME_PICKER_PORTAL_Z_INDEX = DEFAULT_DROPDOWN_Z_INDEX - 1;

export const TIME_RANGE_PICKER_DROPDOWN_INPUT_OFFSET = 8;

export const DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG: Partial<ITextField> = {
	placeholder: 'Select a date',
	type: EInputFieldType.Text,
	icon: EIconName.Calendar,
	state: EValidationState.None,
	tooltipConfig: {
		truncate: false
	}
};

export const DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS: Partial<ComputePositionConfig> = {
	placement: 'bottom-end',
	middleware: [
		offset(TIME_RANGE_PICKER_DROPDOWN_INPUT_OFFSET),
		size({
			apply({ elements }: MiddlewareState) {
				Object.assign(elements.floating.style, {
					width: 'max-content'
				});
			}
		})
	]
};

export const DEFAULT_SELECTED_TIME_KEY = 'last-24-h';

export const FULL_RANGE_SIZE = 2;
export const APPLY_BUTTON_ERROR_TOOLTIP_TEXT = 'Both time inputs must be filled.';

export const UTC_TIMEZONE_OFFSET: ITimezoneOffset = {
	name: 'utc',
	offset: 0,
	label: 'UTC'
};

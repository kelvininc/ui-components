import { ComputePositionConfig, offset, size, MiddlewareState } from '@floating-ui/dom';
import { EIconName } from '../icon/icon.types';
import { EInputFieldType, EValidationState, ITextField } from '../text-field/text-field.types';
import { DEFAULT_DROPDOWN_Z_INDEX } from '../../globals/config';

const DEFAULT_DROPDOWN_OFFSET = 8;

// It needs to be lower because there are other dropdowns with a portal inside
export const ADVANCE_SELECT_PORTAL_Z_INDEX = DEFAULT_DROPDOWN_Z_INDEX - 1;

export const DEFAULT_DATE_INPUT_CONFIG: Partial<ITextField> = {
	placeholder: 'Select a date',
	type: EInputFieldType.Text,
	icon: EIconName.Calendar,
	state: EValidationState.None
};

export const DEFAULT_DROPDOWN_POSITION_OPTIONS: Partial<ComputePositionConfig> = {
	placement: 'bottom-end',
	middleware: [
		offset(DEFAULT_DROPDOWN_OFFSET),
		size({
			apply({ elements }: MiddlewareState) {
				Object.assign(elements.floating.style, {
					width: '544px'
				});
			}
		})
	]
};

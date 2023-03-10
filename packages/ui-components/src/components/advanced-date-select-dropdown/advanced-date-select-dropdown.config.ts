import { ComputePositionConfig, offset, size, MiddlewareState } from '@floating-ui/dom';
import { EIconName } from '../icon/icon.types';
import { EInputFieldType, EValidationState, ITextField } from '../text-field/text-field.types';

const DEFAULT_DROPDOWN_OFFSET = 8;

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

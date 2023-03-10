import { ComputePositionConfig, MiddlewareState, offset, size, flip } from '@floating-ui/dom';
import { EInputFieldType, EValidationState, ITextField } from '../text-field/text-field.types';

export const DROPDOWN_DEFAULT_PLACEHOLDER = 'Select an option';

export const DEFAULT_INPUT_CONFIG: Partial<ITextField> = {
	placeholder: 'Select an option',
	type: EInputFieldType.Text,
	state: EValidationState.None
};

const DEFAULT_DROPDOWN_OFFSET = 8;

export const DEFAULT_DROPDOWN_POSITION_CONFIG: Partial<ComputePositionConfig> = {
	placement: 'bottom',
	middleware: [
		offset(DEFAULT_DROPDOWN_OFFSET),
		flip({
			padding: 16,
			fallbackPlacements: ['top-end', 'bottom-end', 'top-start', 'bottom-start']
		}),
		size({
			apply({ rects, elements }: MiddlewareState) {
				Object.assign(elements.floating.style, {
					width: `${rects.reference.width}px`
				});
			}
		})
	]
};

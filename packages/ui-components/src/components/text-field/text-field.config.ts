import type Inputmask from 'inputmask';
import { ETooltipPosition } from '../../types';
import { ITooltip } from '../tooltip/tooltip.types';

export const COMMON_INPUT_MASK_CONFIG: Inputmask.Options = {
	rightAlign: false,
	showMaskOnHover: false,
	showMaskOnFocus: false,
	clearMaskOnLostFocus: false,
	placeholder: '',
	oncleared: function () {
		this.value = '';
	}
};

export const DEFAULT_TEXT_TOOLTIP_CONFIG: Partial<ITooltip> = {
	position: ETooltipPosition.TopStart,
	truncate: true
};

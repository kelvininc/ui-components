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

export const DATE_TIME_INPUT_MASK_CONFIG: Inputmask.Options = {
	alias: 'datetime',
	inputFormat: 'dd-mm-yyyy HH:MM:ss',
	displayFormat: 'dd-mm-yyyy 00:00:00',
	placeholder: 'dd-mm-yyyy 00:00:00',
	jitMasking: true,
	showMaskOnHover: false,
	clearMaskOnLostFocus: false
};

export const DEFAULT_TEXT_TOOLTIP_CONFIG: Partial<ITooltip> = {
	position: ETooltipPosition.TopStart,
	truncate: true
};

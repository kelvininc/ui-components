import type Inputmask from 'inputmask';
import { ETooltipPosition } from '../../types';
import { ITooltip } from '../tooltip/tooltip.types';

export const NUMERIC_TEXT_INPUT_MASK_CONFIG: Inputmask.Options = {
	alias: 'numeric',
	rightAlign: false,
	showMaskOnHover: false,
	showMaskOnFocus: false
};

export const DEFAULT_TEXT_TOOLTIP_CONFIG: Partial<ITooltip> = {
	position: ETooltipPosition.TopStart
};

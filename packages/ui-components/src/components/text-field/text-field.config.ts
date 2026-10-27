import { ETooltipPosition } from '../../types';
import { ITooltip } from '../tooltip/tooltip.types';

export const DEFAULT_TEXT_TOOLTIP_CONFIG: Partial<ITooltip> = {
	position: ETooltipPosition.TopStart,
	truncate: true
};

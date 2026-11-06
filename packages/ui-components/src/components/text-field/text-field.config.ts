import { ETooltipPosition } from '../../types';
import { ITooltip } from '../tooltip/tooltip.types';

export const DEFAULT_TEXT_TOOLTIP_CONFIG: Partial<ITooltip> = {
	position: ETooltipPosition.TopStart,
	truncate: true
};

/** How fast a value wider than the field scrolls on hover (`scrollOnHover`), in pixels per second. */
export const SCROLL_ON_HOVER_SPEED_IN_PX_PER_S = 80;

/** How long the pointer rests on the field before its value starts scrolling, so a pass-over does not. */
export const SCROLL_ON_HOVER_DELAY_IN_MS = 300;

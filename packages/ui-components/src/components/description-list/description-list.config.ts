import { ComputePositionConfig, offset } from '@floating-ui/dom';
import { ETooltipPosition, IDescriptionListItemToggletipConfig } from '../../types';

const TEXT_TOOLTIP_MAIN_AXIS_OFFSET = 4;

export const DEFAULT_TEXT_TOOLTIP_CONFIG: Partial<ComputePositionConfig> = {
	placement: ETooltipPosition.Bottom,
	middleware: [offset(TEXT_TOOLTIP_MAIN_AXIS_OFFSET)]
};

export const DEFAULT_ICON_TOGGLETIP_CONFIG: IDescriptionListItemToggletipConfig = {
	position: ETooltipPosition.BottomStart
};

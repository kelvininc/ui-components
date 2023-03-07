import { ComputePositionConfig, offset } from '@floating-ui/dom';
import { EIconName } from '../icon/icon.types';
import { ECopyToClipboardState } from './copy-to-clipboard.types';
import { ETooltipPosition } from '../../types';

export const ICON_CONFIGS: Record<ECopyToClipboardState, EIconName> = {
	[ECopyToClipboardState.ReadyToCopy]: EIconName.CopyClipboard,
	[ECopyToClipboardState.Copied]: EIconName.Success
};

export const TOOLTIP_CONFIG: Partial<ComputePositionConfig> = {
	placement: ETooltipPosition.BottomEnd,
	middleware: [
		offset({
			mainAxis: 4,
			crossAxis: -8
		})
	]
};

export const STATE_TRANSITION_DURATION_MS = 2000;
export const UNABLE_TO_COPY_ERROR = 'Unable to copy to clipboard';

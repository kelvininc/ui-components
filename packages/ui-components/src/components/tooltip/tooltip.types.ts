import { ComputePositionConfig } from '@floating-ui/dom';
import { ETooltipPosition } from '../../types';

export interface ITooltip {
	/** (optional) Text of tooltip */
	text: string;
	/** (optional) Position of tooltip */
	position?: ETooltipPosition;
	/** (optional) Object with tooltip position options */
	options?: Partial<ComputePositionConfig>;
	/** (optional) Disables tooltip */
	disabled?: boolean;
	/** (optional) Content element reference */
	contentElement?: HTMLElement;
}

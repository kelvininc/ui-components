import { ComputePositionConfig } from '@floating-ui/dom';
import { ETooltipPosition, ICustomCss } from '../../types';
import { HostAttributes } from '@stencil/core/internal';

export interface ITooltip extends ICustomCss {
	/** (optional) Text of tooltip */
	text: string;
	/** (optional) Position of tooltip */
	position?: ETooltipPosition;
	/** (optional) Array of allowed positions of toggle tip (if defined the 'position' is ignored) */
	allowedPositions?: ETooltipPosition[];
	/** (optional) Object with tooltip position options */
	options?: Partial<ComputePositionConfig>;
	/** (optional) Disables tooltip */
	disabled?: boolean;
	/** (optional) Content element reference */
	contentElement?: HTMLElement;
	/** (optional) Set `true` to display tooltip only when the content is truncated */
	truncate?: boolean;
	/** (optional) Delay to show tooltip in milliseconds. */
	delay?: number;
	/** (optional) if true it will render an arrow pointing to the opening element (default false) */
	withArrow?: boolean;
	/** (optional) Additional style to apply for custom CSS. */
	customStyle?: HostAttributes['style'];
}

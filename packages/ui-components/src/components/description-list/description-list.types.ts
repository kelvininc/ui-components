import { ComputePositionConfig } from '@floating-ui/dom';
import { EIconName, ETooltipPosition, ICopyToClipboard } from '../../types';
import { ICustomCss } from '../../utils/types/components';

export interface IDescriptionListItemToggletipConfig {
	position: ETooltipPosition;
	allowedPositions?: ETooltipPosition[];
}

export interface IDescriptionListItemPopover {
	icon?: EIconName;
	text: string;
}

export interface IDescriptionListItem {
	title: string;
	description: string;
	popoverInfo?: IDescriptionListItemPopover;
	copiableTextConfig?: ICopyToClipboard;
}

export interface IDescriptionList extends ICustomCss {
	/** (required) The array of items to display in the list */
	items: IDescriptionListItem[];
	/** (optional) The config to use on the tooltip that shows hovering the text */
	descriptionTooltipConfig?: Partial<ComputePositionConfig>;
	/** (optional) The config to use on the icon toggletip */
	iconToggletipConfig?: IDescriptionListItemToggletipConfig;
}

import { EAnchorTarget, EIconName } from '../../types';

export interface ILink {
	/** (required) Main component label */
	label: string;
	/** (optional) The name of the icon to be rendered on the right side of the label */
	rightIcon?: EIconName;
	/** (optional) The name of the icon to be rendered on the left side of the label */
	leftIcon?: EIconName;
	/** (optional) Description for the label */
	subtitle?: string;
	/** (optional) Defines if the link are disabled. Default: false*/
	disabled?: boolean;
	/** (optional) Whether the link is displayed inline. Default: false*/
	inline?: boolean;
	/** (optional) The anchor's link to open when clicking */
	href?: string;
	/** (optional) The anchor's target */
	target?: EAnchorTarget;
	/** (optional) Specifies that the target will be downloaded when a user clicks on. The value should be the filename */
	download?: string;
}

import { EAnchorTarget } from '../../types';

export interface ILink {
	/** (optional) The anchor's link to open when clicking */
	href?: string;
	/** (optional) The anchor's target */
	target?: EAnchorTarget;
	/** (optional) Specifies that the target will be downloaded when a user clicks on. The value should be the filename */
	download?: string;
}

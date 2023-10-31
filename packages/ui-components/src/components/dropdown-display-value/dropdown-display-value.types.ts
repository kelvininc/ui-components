import { EComponentSize } from '../../types';

export interface IDropdownDisplayValue {
	/**
	 * (optional) Sets the size of this component to one of
	 * 'EComponentSize.Small' or 'EComponentSize.Large'
	 * defaults to large
	 */
	size?: EComponentSize;
	/** (required) Defines if the text and badge should be visible */
	visible: boolean;
	/** (optional) Defines if the text should use `disabled` styling */
	disabled?: boolean;
	/** (optional) Defines the display value */
	value?: string;
	/** (optional) Defines the prefix that adds context to displayed values */
	valuePrefix?: string;
	/** (optional) Defines the badge text to use */
	badge?: string;
}

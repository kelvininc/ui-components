export interface ISingleSelectDropdownOption {
	label: string;
	value: string;
}

export const DROPDOWN_NO_DATA_AVAILABLE = 'No data available';

export interface ISingleSelectDropdownOptions {
	[key: string]: ISingleSelectDropdownOption;
}
export interface ISingleSelectDropdown {
	options?: ISingleSelectDropdownOptions;
}

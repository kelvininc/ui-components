export interface ICheckboxConfig {
	multiple: boolean;
	allButton: boolean;
	minItems: number;
	maxItems: number;
	required?: boolean;
	readonly?: boolean;
}

export type CheckboxOption = { label: string; value: string };

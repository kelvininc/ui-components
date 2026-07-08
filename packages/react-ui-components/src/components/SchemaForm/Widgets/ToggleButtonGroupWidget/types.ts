export interface IToggleButtonGroupConfig {
	multiple: boolean;
	allButton: boolean;
	minItems: number;
	maxItems: number;
	required?: boolean;
	readonly?: boolean;
}

export type ToggleButtonGroupOption = { label: string; value: string };

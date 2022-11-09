import { IRadioButton } from '@kelvininc/ui-components';
import { ALL_BUTTON_VALUE } from './config';
import { CheckboxOption, ICheckboxConfig } from './types';

export const buildRadioButtons = <T extends CheckboxOption>(options: T[], enumDisabled: string[], { multiple, allButton, disabled, readonly }: ICheckboxConfig): IRadioButton[] =>
	options.reduce<IRadioButton[]>(
		(accumulator, { label, value }) => [
			...accumulator,
			{
				label,
				value,
				disabled: disabled || enumDisabled.includes(value) || readonly
			}
		],
		multiple && allButton
			? [
					{
						label: 'All',
						value: ALL_BUTTON_VALUE
					}
			  ]
			: []
	);

export const buildSelectedRadioButtons = <T extends CheckboxOption>(
	selectedOptions: string[],
	allOptions: T[],
	{ multiple, allButton }: ICheckboxConfig
): { [key: string]: boolean } => {
	const allButtonsSelected = selectedOptions.length === allOptions.length;

	// check if all conditions are meet:
	// - multiple buttons selectable
	// - 'All' button is enabled
	// - all buttons are selected
	if (multiple && allButton && allButtonsSelected) {
		return { [ALL_BUTTON_VALUE]: true };
	}

	return selectedOptions.reduce<{ [key: string]: boolean }>((accumulator, selectOption) => {
		accumulator[selectOption] = true;

		return accumulator;
	}, {});
};

export const toggleSelectedOptions = <T extends { label: string; value: string }>(
	selectedOptionValue: string,
	selectedOptions: string[],
	allOptions: T[],
	{ multiple, allButton, minItems, maxItems, required }: ICheckboxConfig
): string[] => {
	if (!multiple) {
		if (selectedOptions.includes(selectedOptionValue)) {
			return [];
		}

		return [selectedOptionValue];
	}

	const allButtonsSelected = selectedOptions.length === allOptions.length;

	if (allButton) {
		// check if the user clicked on 'All' button
		if (selectedOptionValue === ALL_BUTTON_VALUE) {
			// reset to the minimum selectable options
			if (allButtonsSelected) {
				if (required || minItems > 0) {
					return allOptions.slice(0, minItems).map(({ value }) => value);
				}

				return [];
			}

			return allOptions.map(({ value }) => value);
		}
	}

	// check if the button was already checked
	if (selectedOptions.includes(selectedOptionValue)) {
		// don't deselect if selected options length are already the minimum
		if (selectedOptions.length === minItems) {
			return selectedOptions;
		}

		return selectedOptions.filter(value => value !== selectedOptionValue);
	}

	// don't select if selected options length are already the maximum
	if (selectedOptions.length === maxItems) {
		return selectedOptions;
	}

	return [...selectedOptions, selectedOptionValue];
};

import { EComponentSize, IToggleButton } from '@kelvininc/ui-components';
import { ALL_BUTTON_VALUE } from './config';
import { CheckboxOption, ICheckboxConfig } from './types';

export const buildToggleButtons = <T extends CheckboxOption>(
	options: T[],
	enumDisabled: (string | number | boolean)[],
	{ multiple, allButton, readonly }: ICheckboxConfig
): IToggleButton[] =>
	options.reduce<IToggleButton[]>(
		(acc, { label, value }) => [
			...acc,
			{
				label,
				value,
				disabled: enumDisabled.includes(value) || readonly
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

export const buildSelectedToggleButtons = <T extends CheckboxOption>(
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

	return selectedOptions.reduce<{ [key: string]: boolean }>((acc, selectOption) => {
		acc[selectOption] = true;

		return acc;
	}, {});
};

export const buildDisabledToggleButtons = (buttons: IToggleButton[]): { [key: string]: boolean } => {
	const disabledButtons: { [key: string]: boolean } = buttons.reduce<{ [key: string]: boolean }>((acc, button) => {
		acc[button.value] = button.disabled ?? false;

		return acc;
	}, {});

	disabledButtons[ALL_BUTTON_VALUE] = Object.values(disabledButtons).some(value => value);

	return disabledButtons;
};

export const toggleSelectedOptions = <T extends CheckboxOption>(
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

		if (allButtonsSelected) return [selectedOptionValue];

		// when trying to deselected the last option, 'All' button should be selected
		if (selectedOptions.includes(selectedOptionValue) && selectedOptions.length === minItems) {
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

export const getComponentSize = (size: unknown): EComponentSize => {
	return Object.values(EComponentSize).includes(size as EComponentSize) ? (size as EComponentSize) : EComponentSize.Small;
};

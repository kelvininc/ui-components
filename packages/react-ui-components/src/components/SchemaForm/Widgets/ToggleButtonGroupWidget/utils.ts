import { EComponentSize, IToggleButton } from '@kelvininc/ui-components';
import { ALL_BUTTON_VALUE } from './config';
import { ToggleButtonGroupOption, IToggleButtonGroupConfig } from './types';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import { getOptionKey } from '../utils';

// Buttons are keyed by position, not by value: `selectedButtons` and `disabledButtons` are objects, so `0`
// and `'0'` would share a key. Only the All button keeps its own key, which no position key can take.

export const buildToggleButtons = <T extends ToggleButtonGroupOption>(
	options: T[],
	enumDisabled: (string | number | boolean)[],
	{ multiple, allButton, readonly }: IToggleButtonGroupConfig
): IToggleButton[] =>
	options.reduce<IToggleButton[]>(
		(acc, { label, value }, index) => {
			acc.push({
				label,
				value: getOptionKey(index),
				disabled: enumDisabled.includes(value) || readonly
			});

			return acc;
		},
		multiple && allButton
			? [
					{
						label: SCHEMA_FORM_STRINGS.all,
						value: ALL_BUTTON_VALUE
					}
			  ]
			: []
	);

export const buildSelectedToggleButtons = <T extends ToggleButtonGroupOption>(
	selectedOptions: (string | number)[],
	allOptions: T[],
	{ multiple, allButton }: IToggleButtonGroupConfig
): { [key: string]: boolean } => {
	const allButtonsSelected = selectedOptions.length === allOptions.length;

	// check if all conditions are meet:
	// - multiple buttons selectable
	// - 'All' button is enabled
	// - all buttons are selected
	if (multiple && allButton && allButtonsSelected) {
		return { [ALL_BUTTON_VALUE]: true };
	}

	// Strict equality, as toggleSelectedOptions compares values, so what shows as selected is what toggles
	return selectedOptions.reduce<{ [key: string]: boolean }>((acc, selectOption) => {
		const index = allOptions.findIndex(({ value }) => value === selectOption);
		if (index !== -1) acc[getOptionKey(index)] = true;

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

/** The new selection after the button with `buttonKey` is pressed: the All button's key, or an option's key */
export const toggleSelectedOptions = <T extends ToggleButtonGroupOption>(
	buttonKey: string | number,
	selectedOptions: (string | number)[],
	allOptions: T[],
	{ multiple, allButton, minItems, maxItems, required }: IToggleButtonGroupConfig
): (string | number)[] => {
	const pressedAll = multiple && allButton && buttonKey === ALL_BUTTON_VALUE;
	const option = allOptions.find((_, index) => getOptionKey(index) === buttonKey);
	if (!pressedAll && !option) return selectedOptions;
	const selectedOptionValue = option?.value as string | number;

	if (!multiple) {
		if (selectedOptions.includes(selectedOptionValue)) {
			return [];
		}

		return [selectedOptionValue];
	}

	const allButtonsSelected = selectedOptions.length === allOptions.length;

	if (allButton) {
		// check if the user clicked on 'All' button
		if (pressedAll) {
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

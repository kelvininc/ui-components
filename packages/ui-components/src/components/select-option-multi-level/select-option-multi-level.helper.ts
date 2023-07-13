import { isEmpty } from 'lodash';
import { ISelectMultiOption, ISelectMultiOptions } from '../select-multi-options/select-multi-options.types';
import { ELevelState } from './select-option-multi-level.types';

export const calculateLevelState = (options: ISelectMultiOption[], selectedOptions: Record<string, boolean>, levelsState: Record<string, ELevelState>): ELevelState => {
	const optionsLength = options.length;
	let optionsCounter = 0;

	for (const option of options) {
		if (levelsState?.[option.value] === ELevelState.Indeterminate) {
			return ELevelState.Indeterminate;
		}

		const isSelected = isEmpty(option.children) ? selectedOptions[option.value] : levelsState?.[option.value] === ELevelState.Selected;
		if (isSelected) {
			optionsCounter++;
		}
	}

	if (optionsCounter === optionsLength) return ELevelState.Selected;
	return optionsCounter > 0 ? ELevelState.Indeterminate : ELevelState.None;
};

export const getAllChildrenValues = (options: ISelectMultiOptions): string[] => {
	if (!options || Object.values(options).length <= 0) {
		return [];
	}
	return Object.values(options).reduce((acc, option) => {
		if (isEmpty(option.children)) {
			acc.push(option.value);
		} else {
			acc = acc.concat(getAllChildrenValues(option.children));
		}
		return acc;
	}, []);
};

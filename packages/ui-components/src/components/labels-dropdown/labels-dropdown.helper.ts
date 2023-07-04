import { isEmpty } from 'lodash';
import { EIconName } from '../../types';
import { ISelectMultiOption, ISelectMultiOptions } from '../select-multi-options/select-multi-options.types';
import { INPUT_ITEM_MARGIN_OFFSET } from './labels-dropdown.config';

export const getTextFieldConfig = (optionsEmpty: boolean) => {
	return {
		placeholder: optionsEmpty ? 'Click to select or create labels...' : '',
		icon: EIconName.Datalabel
	};
};

export const getFlattenedOptionsMap = (options: ISelectMultiOptions): Record<string, ISelectMultiOption> => {
	if (!options || Object.values(options).length === 0) {
		return {};
	}
	return Object.values(options).reduce((acc, option) => {
		if (isEmpty(option.children)) {
			acc[option.value] = option;
		} else {
			acc = { ...acc, ...getFlattenedOptionsMap(option.children) };
		}
		return acc;
	}, {});
};

const getOverflowingInputItems = (dropdownRef: HTMLKvDropdownElement, items: Array<HTMLKvLabelsDropdownInputItemElement>, containerSelector: string) => {
	const containerWidth = dropdownRef.querySelector(containerSelector).clientWidth - INPUT_ITEM_MARGIN_OFFSET;
	return items.filter(labelEl => labelEl.offsetLeft + labelEl.clientWidth >= containerWidth);
};

export const setOverflowingLabels = (dropdownRef: HTMLKvDropdownElement): number => {
	const inputItems = Array.from(dropdownRef.querySelectorAll('kv-labels-dropdown-input-item'));
	inputItems.forEach(el => (el.style.display = 'block'));

	const overflowingItems = getOverflowingInputItems(dropdownRef, inputItems, '.selected-labels-container');
	overflowingItems.forEach(el => (el.style.display = 'none'));

	return overflowingItems.length;
};

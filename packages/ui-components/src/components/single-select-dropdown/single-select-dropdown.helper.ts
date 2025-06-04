import { isEmpty } from 'lodash-es';
import { EIconName, ISelectMultiOption, ISelectOption, ISelectSingleOptions } from '../../types';
import { HostAttributes } from '@stencil/core/internal';

export const getDropdownDisplayIcon = (selectedOption?: string, flattenOptions: Record<string, ISelectOption> = {}): EIconName | undefined => {
	if (!selectedOption || !flattenOptions[selectedOption]) {
		return;
	}

	const option = flattenOptions[selectedOption];
	return option.icon;
};

export const getDropdownCustomCss = (selectedOption?: string, flattenOptions: Record<string, ISelectOption> = {}): HostAttributes['style'] | undefined => {
	if (!selectedOption || !flattenOptions[selectedOption]) {
		return;
	}

	const option = flattenOptions[selectedOption];
	return option.customStyle;
};

export const buildSingleSelectOptions = (options: ISelectSingleOptions = {}): Record<string, ISelectMultiOption> =>
	Object.values(options).reduce<Record<string, ISelectMultiOption>>((accumulator, option) => {
		accumulator[option.value] = {
			...option,
			selectable: isEmpty(option.options),
			options: buildSingleSelectOptions(option.options),
			togglable: false
		};

		return accumulator;
	}, {});

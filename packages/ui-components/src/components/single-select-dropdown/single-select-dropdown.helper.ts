import { isEmpty } from 'lodash';
import { ISelectMultiOption, ISelectSingleOptions } from '../../types';

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

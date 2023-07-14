import { isEmpty } from 'lodash';
import { ISelectMultiOptions, ISelectMultiOption } from './select-multi-options.types';

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

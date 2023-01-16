import { isEmpty } from 'lodash';

export const isValidLabel = (label: string) => {
	return !isEmpty(label?.trim());
};

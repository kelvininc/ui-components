import { isEmpty } from 'lodash-es';

export const isValidLabel = (label: string) => {
	return !isEmpty(label?.trim());
};

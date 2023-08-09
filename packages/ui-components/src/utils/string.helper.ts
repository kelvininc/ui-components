import { isEmpty } from 'lodash-es';

export const isValidLabel = (label: string) => {
	return !isEmpty(label?.trim());
};

export const getUTF8StringLength = (label: string) => {
	return label ? [...label].length : 0;
};

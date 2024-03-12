import { isEmpty } from 'lodash-es';

export const isValidLabel = (label: string) => {
	return !isEmpty(label?.trim());
};

export const getUTF8StringLength = (label: string) => {
	return label ? [...label].length : 0;
};

export const isSubString = (term: string, string: string, caseSensitive = false): boolean => {
	if (term.length === 0) {
		return true;
	}

	if (caseSensitive) {
		return string.includes(term);
	}

	return string.toLocaleLowerCase().includes(term.toLocaleLowerCase());
};

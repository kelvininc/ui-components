import { CssClassMap } from '../types';

export const getClassList = (classes: string | (string | null | undefined)[] | undefined): string[] => {
	if (classes !== undefined) {
		const array = Array.isArray(classes) ? classes : classes.split(' ');
		return array
			.filter(c => c != null)
			.map(c => (c as string).trim())
			.filter(c => c !== '');
	}
	return [];
};

export const getClassMap = (classes: string | string[] | CssClassMap | undefined): CssClassMap => {
	if (typeof classes === 'object' && !Array.isArray(classes)) {
		return classes;
	}
	const map: CssClassMap = {};

	getClassList(classes).forEach(c => (map[c] = true));

	return map;
};

import { isNil } from 'lodash';

export const isElementVisible = (element: HTMLElement, selector: string): boolean => {
	const foundElement = element.querySelector(selector);

	return !isNil(foundElement) && foundElement.clientHeight > 0 && foundElement.clientWidth > 0;
};

export const isElementVisible = (element: HTMLElement, selector: string): boolean => {
	const foundElement = element.querySelector(selector);

	return foundElement !== null && foundElement.clientHeight > 0 && foundElement.clientWidth > 0;
};

export const hasAnyVisibleElement = (element: HTMLElement, selector: string): boolean => {
	const foundElements = element.querySelectorAll(selector);

	return Array.from(foundElements).some(el => el.clientHeight > 0 && el.clientWidth > 0);
};

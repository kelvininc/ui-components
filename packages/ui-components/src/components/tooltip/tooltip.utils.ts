import { getCollapsedElement } from '../utils';

export const isElementCollpased = (element: HTMLElement): boolean => {
	const collapsedElement = getCollapsedElement(Array.from(element.childNodes));
	if (collapsedElement !== undefined) {
		const range = new Range();
		range.selectNodeContents(collapsedElement);

		const { width: rectWidth } = range.getBoundingClientRect();
		const { clientWidth: collapsedWidth } = collapsedElement;

		// once rectWidth comes as a real value and collapsedWidth as a rounded value, this calculation was incorrect.
		if (collapsedWidth >= Math.round(rectWidth)) return false;
	}

	return true;
};

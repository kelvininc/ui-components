import { getCollapsedElement } from '../utils';

export const isElementCollapsed = (element: HTMLElement): boolean => {
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

export const forwardStyleProperties = (tooltipContainer: HTMLElement, parent: HTMLKvTooltipElement) => {
	const computedStyle = getComputedStyle(parent);
	tooltipContainer.style.setProperty('--container-z-index', computedStyle.getPropertyValue('--container-z-index'));
	tooltipContainer.style.setProperty('--container-white-space', computedStyle.getPropertyValue('--container-white-space'));
	tooltipContainer.style.setProperty('--container-max-width', computedStyle.getPropertyValue('--container-max-width'));
};

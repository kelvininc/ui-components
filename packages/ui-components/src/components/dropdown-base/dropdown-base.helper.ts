import { isNil } from 'lodash-es';

export const getSlotElements = (element: HTMLElement): HTMLElement[] => ((element.querySelector('slot') as HTMLSlotElement | null)?.assignedNodes() as HTMLElement[]) ?? [];
export const didClickOnElement = (element: HTMLElement | null, event: MouseEvent): boolean => {
	if (isNil(element)) {
		return false;
	}

	if (isTargetOnElement(element, event)) {
		return true;
	}

	const slotElements = getSlotElements(element);
	for (let index = 0; index < slotElements.length; index++) {
		const slotElement = slotElements[index];

		if (isTargetOnElement(slotElement, event)) {
			return true;
		}
	}

	return false;
};

export const isTargetOnElement = (selectElement: HTMLElement, event: MouseEvent): boolean => event.composedPath().some(element => element === selectElement);

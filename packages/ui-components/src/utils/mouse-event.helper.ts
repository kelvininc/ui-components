export const getSlotElements = (element: HTMLElement): HTMLElement[] => ((element.querySelector('slot') as HTMLSlotElement | null)?.assignedNodes() as HTMLElement[]) ?? [];
export const didClickOnElement = (element: HTMLElement | null, event: MouseEvent): boolean => {
	if (element === null) {
		return false;
	}

	if (isTargetOnElement(element, event)) {
		return true;
	}

	const slotElements = getSlotElements(element);
	for (let index = 0; index < slotElements.length; index++) {
		const slotElement = slotElements[index];
		if (slotElement === undefined) continue;

		if (isTargetOnElement(slotElement, event)) {
			return true;
		}
	}

	return false;
};

export const isTargetOnElement = (selectElement: HTMLElement, event: MouseEvent | KeyboardEvent): boolean => event.composedPath().some(element => element === selectElement);

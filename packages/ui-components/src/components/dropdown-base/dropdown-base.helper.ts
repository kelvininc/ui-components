export const getSlotElement = (element: HTMLElement): HTMLElement | undefined => {
	const [slotElement] = ((element.querySelector('slot') as HTMLSlotElement | undefined)?.assignedNodes() as HTMLElement[]) ?? [];

	return slotElement;
};

export const isTargetOnElement = (event: MouseEvent, selectElement: HTMLElement): boolean => event.composedPath().some(element => element === selectElement);

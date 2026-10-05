const describedControls = new WeakSet<Element>();

/** Connects a control to description elements in its tree or an ancestor tree. */
export const setAccessibleDescriptionElements = (control: Element | undefined, elements?: readonly Element[]): void => {
	if (!control || !('ariaDescribedByElements' in control)) return;
	if (elements !== undefined) {
		control.ariaDescribedByElements = elements;
		describedControls.add(control);
	} else if (describedControls.delete(control) && control.getAttribute('aria-describedby') === '') {
		control.ariaDescribedByElements = null;
	}
};

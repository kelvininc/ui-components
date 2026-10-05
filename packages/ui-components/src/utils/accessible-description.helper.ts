const describedControls = new WeakMap<Element, string | null>();

/** Connects a control to description elements in its tree or an ancestor tree. */
export const setAccessibleDescriptionElements = (control: Element | undefined, elements?: readonly Element[]): void => {
	if (!control || !('ariaDescribedByElements' in control)) return;
	const description = control.getAttribute('aria-describedby');
	if (elements !== undefined) {
		if (!describedControls.has(control) || description !== '') describedControls.set(control, description);
		control.ariaDescribedByElements = elements;
	} else {
		const previousDescription = describedControls.get(control);
		describedControls.delete(control);
		if (previousDescription !== undefined && description === '') {
			control.ariaDescribedByElements = null;
			if (previousDescription !== null) control.setAttribute('aria-describedby', previousDescription);
		}
	}
};

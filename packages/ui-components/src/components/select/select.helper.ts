export const hasAnyVisibleElement = (element: HTMLElement, selector: string): boolean => {
	const foundElements = element.querySelectorAll(selector);

	return Array.from(foundElements).some(el => el.clientHeight > 0 && el.clientWidth > 0);
};

/**
 * The elements a host's `name` slot holds, a forwarded slot resolved to what it carries. A wrapper
 * that passes the slot on (`kv-select-multi-options` does, for `kv-single-select-dropdown`) puts a
 * `<slot>` there, which never has a box of its own.
 */
const getSlottedElements = (host: HTMLElement, name: string): Element[] =>
	Array.from(host.children)
		.filter(child => child.getAttribute('slot') === name)
		.flatMap(child => (child.tagName === 'SLOT' ? ((child as HTMLSlotElement).assignedElements?.({ flatten: true }) ?? []) : [child]));

/**
 * Whether the host's `name` slot holds anything to show. Content is not measured: it gets no box until the
 * slot it fills is rendered, and the slot is rendered only once this says so. Only `hidden` content counts as none.
 */
export const hasSlottedContent = (host: HTMLElement, name: string): boolean => getSlottedElements(host, name).some(element => !(element as HTMLElement).hidden);

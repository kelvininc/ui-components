const DOCUMENT_FRAGMENT_NODE = 11;
const PORTAL_NODE_NAME = 'KV-PORTAL';

/** The node's parent, stepping out of a shadow root to its host */
export const getComposedParent = (node: Node): Node | null => {
	const parent = node.parentNode;

	// Told apart by its node type rather than with `instanceof ShadowRoot`, which mock-doc's shadow roots, plain
	// document fragments, are not
	if (parent?.nodeType === DOCUMENT_FRAGMENT_NODE) {
		return (parent as ShadowRoot).host ?? null;
	}

	return parent;
};

export const isPortal = (target: EventTarget): target is HTMLKvPortalElement => (target as Partial<Node>).nodeName === PORTAL_NODE_NAME;

/**
 * Whether an event's path goes through a portal that is anchored, directly or through other portals, within one of
 * the containers: the list of a dropdown, or a tooltip, opened from inside them is portaled to the body, outside them.
 * A portal is anchored where its `reference` is, and a chain of portals that loops back on itself anchors nowhere.
 */
export const isInPortalAnchoredWithin = (path: EventTarget[], ownPortal: HTMLElement | null | undefined, containers: Array<Node | null | undefined>): boolean => {
	const visitedPortals = new Set<HTMLKvPortalElement>();
	let portal = path.find((target): target is HTMLKvPortalElement => isPortal(target) && target !== ownPortal);

	while (portal !== undefined && !visitedPortals.has(portal)) {
		visitedPortals.add(portal);

		let node: Node | null = portal.reference ?? null;
		portal = undefined;

		while (node !== null && portal === undefined) {
			if (containers.includes(node)) {
				return true;
			}

			if (isPortal(node)) {
				// Anchored inside another portal, which is anchored where its own reference is
				portal = node;
			} else {
				node = getComposedParent(node);
			}
		}
	}

	return false;
};

// The open dropdowns' host elements, the most recently opened last
const openDropdowns: HTMLElement[] = [];

export const removeOpenDropdown = (element: HTMLElement): void => {
	const index = openDropdowns.indexOf(element);

	if (index !== -1) {
		openDropdowns.splice(index, 1);
	}
};

/** Adds a dropdown that has just opened, as the most recently opened one */
export const addOpenDropdown = (element: HTMLElement): void => {
	removeOpenDropdown(element);
	openDropdowns.push(element);
};

/** Adds a dropdown found open, unless it is known already: one moved while open keeps its place */
export const trackOpenDropdown = (element: HTMLElement): void => {
	if (!openDropdowns.includes(element)) {
		openDropdowns.push(element);
	}
};

/**
 * Whether the dropdown is the most recently opened one that is still in the document: one that has left it is only
 * dropped once its removal is confirmed, and mock-doc doesn't always disconnect a page's elements before the next.
 */
export const isTopmostOpenDropdown = (element: HTMLElement): boolean => {
	for (let index = openDropdowns.length - 1; index >= 0; index--) {
		if (openDropdowns[index].isConnected) {
			return openDropdowns[index] === element;
		}
	}

	return false;
};

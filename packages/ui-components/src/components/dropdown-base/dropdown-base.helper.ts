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

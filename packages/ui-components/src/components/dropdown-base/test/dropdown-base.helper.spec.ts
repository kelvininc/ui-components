import { getComposedParent, isInPortalAnchoredWithin, isPortal } from '../dropdown-base.helper';

const createElement = <T extends HTMLElement = HTMLElement>(tagName: string, parent: Node): T => {
	const element = document.createElement(tagName) as T;
	parent.appendChild(element);

	return element;
};

// A list portaled to the body, anchored where its reference is
const createPortal = (reference: HTMLElement | null): HTMLKvPortalElement => {
	const portal = createElement<HTMLKvPortalElement>('kv-portal', document.body);
	portal.reference = reference;

	return portal;
};

const getEventPath = (target: HTMLElement): EventTarget[] => {
	const event = new MouseEvent('mousedown', { bubbles: true, composed: true });
	target.dispatchEvent(event);

	return event.composedPath();
};

describe('dropdown-base.helper', () => {
	let container: HTMLElement;
	let anchor: HTMLElement;

	beforeEach(() => {
		document.body.innerHTML = '';
		container = createElement('div', document.body);
		anchor = createElement('button', container);
	});

	describe('#getComposedParent', () => {
		it('should return the parent of a node', () => {
			expect(getComposedParent(anchor)).toBe(container);
		});

		it('should return the host of a shadow root for a node at its top', () => {
			const host = createElement('div', container);
			const shadowChild = createElement('span', host.attachShadow({ mode: 'open' }));

			expect(getComposedParent(shadowChild)).toBe(host);
		});

		it('should return null for a node without a parent', () => {
			expect(getComposedParent(document.createElement('div'))).toBeNull();
		});
	});

	describe('#isPortal', () => {
		it('should only be true for a kv-portal', () => {
			expect(isPortal(document.createElement('kv-portal'))).toBe(true);
			expect(isPortal(anchor)).toBe(false);
			expect(isPortal(window)).toBe(false);
		});
	});

	describe('#isInPortalAnchoredWithin', () => {
		it('should be true in a portal anchored within a container', () => {
			const option = createElement('button', createPortal(anchor));

			expect(isInPortalAnchoredWithin(getEventPath(option), null, [container])).toBe(true);
		});

		it('should be true in a portal anchored within a shadow root inside a container', () => {
			const shadowAnchor = createElement('button', createElement('div', container).attachShadow({ mode: 'open' }));
			const option = createElement('button', createPortal(shadowAnchor));

			expect(isInPortalAnchoredWithin(getEventPath(option), null, [container])).toBe(true);
		});

		it('should be true in a portal anchored within another portal anchored within a container', () => {
			const nestedAnchor = createElement('button', createPortal(anchor));
			const option = createElement('button', createPortal(nestedAnchor));

			expect(isInPortalAnchoredWithin(getEventPath(option), null, [container])).toBe(true);
		});

		it('should be false in a portal anchored outside every container', () => {
			const option = createElement('button', createPortal(createElement('button', document.body)));

			expect(isInPortalAnchoredWithin(getEventPath(option), null, [container])).toBe(false);
		});

		it('should be false in a portal without a reference', () => {
			const option = createElement('button', createPortal(null));

			expect(isInPortalAnchoredWithin(getEventPath(option), null, [container])).toBe(false);
		});

		it('should be false outside any portal', () => {
			expect(isInPortalAnchoredWithin(getEventPath(createElement('button', document.body)), null, [container])).toBe(false);
		});

		it('should skip its own portal', () => {
			const ownPortal = createPortal(anchor);
			const option = createElement('button', ownPortal);

			expect(isInPortalAnchoredWithin(getEventPath(option), ownPortal, [container])).toBe(false);
		});

		it('should be false in a portal anchored within itself', () => {
			const portal = createPortal(null);
			portal.reference = createElement('button', portal);

			expect(isInPortalAnchoredWithin(getEventPath(portal.reference), null, [container])).toBe(false);
		});

		it('should be false in portals anchored within each other', () => {
			const firstPortal = createPortal(null);
			const secondPortal = createPortal(createElement('button', firstPortal));
			firstPortal.reference = createElement('button', secondPortal);
			const option = createElement('button', firstPortal);

			expect(isInPortalAnchoredWithin(getEventPath(option), null, [container])).toBe(false);
		});
	});
});

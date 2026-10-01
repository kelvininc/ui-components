import { newSpecPage } from '@stencil/core/testing';
import type { SpecPage } from '@stencil/core/testing';

import { KvDropdownBase } from '../dropdown-base';
import { KvPortal } from '../../portal/portal';

const OUTER_DROPDOWN = `
	<kv-dropdown-base id="outer">
		<button slot="action" id="outer-action">Outer</button>
		<div slot="list" id="outer-list"><button id="outer-option">Option</button></div>
	</kv-dropdown-base>
`;
const INNER_DROPDOWN = `
	<kv-dropdown-base id="inner">
		<button slot="action" id="inner-action">Inner</button>
		<div slot="list" id="inner-list"><button id="inner-option">Option</button></div>
	</kv-dropdown-base>
`;
// A dropdown inside another one's list, as a colour picker inside a select's create form
const NESTED_DROPDOWNS = `
	<kv-dropdown-base id="outer">
		<button slot="action" id="outer-action">Outer</button>
		<div slot="list" id="outer-list">
			<button id="outer-option">Option</button>
			${INNER_DROPDOWN}
		</div>
	</kv-dropdown-base>
`;

describe('KvDropdownBase (unit tests)', () => {
	let page: SpecPage;

	const renderDropdowns = async (html: string): Promise<void> => {
		page = await newSpecPage({ components: [KvDropdownBase, KvPortal], html });
	};

	const getElement = <T extends HTMLElement = HTMLElement>(selector: string): T | null => page.doc.querySelector<T>(selector);

	// The list is moved, with its portal, to the body
	const getListPortal = (listSelector: string): HTMLKvPortalElement | null => getElement(listSelector)?.closest('kv-portal') ?? null;

	type RecordedEvents = [string, unknown][];

	// The dropdown's own events: an inner dropdown's bubble from its place in the outer list, past the outer list's portal
	const recordEvents = (selector: string): RecordedEvents => {
		const events: RecordedEvents = [];
		const element = getElement(selector);
		const recordOwnEvent = ({ type, detail, target }: CustomEvent) => {
			if (target === element) {
				// clickOutside carries the mouse event, of which only the emission matters here
				events.push([type, type === 'clickOutside' ? true : detail]);
			}
		};

		element.addEventListener('openStateChange', recordOwnEvent);
		element.addEventListener('clickOutside', recordOwnEvent);

		return events;
	};

	const setOpen = async (selector: string, isOpen: boolean): Promise<void> => {
		getElement<HTMLKvDropdownBaseElement>(selector).isOpen = isOpen;
		await page.waitForChanges();
	};

	const pressMouse = async (selector: string): Promise<void> => {
		getElement(selector).dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
		await page.waitForChanges();
	};

	// From the body, as a key with nothing focused, so that it reaches the window as it bubbles
	const pressEscape = async (init: KeyboardEventInit = {}): Promise<KeyboardEvent> => {
		const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true, ...init });
		page.body.dispatchEvent(event);
		await page.waitForChanges();

		return event;
	};

	const expectInnerListKept = (): void => {
		const innerPortal = getListPortal('#inner-list');

		expect(getListPortal('#inner-action')).toBe(getListPortal('#outer-list'));
		expect(innerPortal).not.toBeNull();
		expect(innerPortal.isConnected).toBe(true);
		expect(innerPortal).not.toBe(getListPortal('#outer-list'));
	};

	describe('when a dropdown is in the list of another one', () => {
		// Mock-doc moves the outer list to the body before the inner dropdown's list has loaded
		beforeEach(() => renderDropdowns(NESTED_DROPDOWNS));

		it('should keep its list after the outer list moves to the body', expectInnerListKept);
	});

	describe('when a loaded dropdown is moved into the list of another one', () => {
		// As a browser most often loads the inner dropdown's list before the outer list moves to the body
		beforeEach(async () => {
			await renderDropdowns(`${OUTER_DROPDOWN}${INNER_DROPDOWN}`);
			getElement('#outer-list').appendChild(getElement('#inner'));
			await page.waitForChanges();
		});

		it('should keep its list', expectInnerListKept);

		it('should remove its list when it is removed', async () => {
			const innerPortal = getListPortal('#inner-list');

			getElement('#inner').remove();
			await page.waitForChanges();

			expect(innerPortal.isConnected).toBe(false);
			expect(getElement('#inner-list')).toBeNull();
			expect(getListPortal('#outer-list').isConnected).toBe(true);
		});
	});

	describe('when a dropdown is open in the list of another open one', () => {
		let outerEvents: RecordedEvents;
		let innerEvents: RecordedEvents;

		beforeEach(async () => {
			await renderDropdowns(NESTED_DROPDOWNS);
			await setOpen('#outer', true);
			await setOpen('#inner', true);
			outerEvents = recordEvents('#outer');
			innerEvents = recordEvents('#inner');
		});

		it('should not take a click in the inner list for a click outside the outer one', async () => {
			await pressMouse('#inner-option');

			expect(outerEvents).toEqual([]);
			expect(innerEvents).toEqual([]);
		});

		it('should close the inner one only on a click elsewhere in the outer list', async () => {
			await pressMouse('#outer-option');

			expect(outerEvents).toEqual([]);
			expect(innerEvents).toEqual([
				['openStateChange', false],
				['clickOutside', true]
			]);
		});

		it('should close both on a click outside them', async () => {
			await pressMouse('body');

			expect(outerEvents).toEqual([
				['openStateChange', false],
				['clickOutside', true]
			]);
			expect(innerEvents).toEqual([
				['openStateChange', false],
				['clickOutside', true]
			]);
		});

		it('should close the inner one only on Escape', async () => {
			const event = await pressEscape();

			expect(innerEvents).toEqual([['openStateChange', false]]);
			expect(outerEvents).toEqual([]);
			expect(event.defaultPrevented).toBe(true);
		});
	});

	describe('when Escape is pressed with dropdowns open', () => {
		let firstEvents: RecordedEvents;
		let secondEvents: RecordedEvents;

		beforeEach(async () => {
			await renderDropdowns(`${OUTER_DROPDOWN.replace(/outer/g, 'first')}${OUTER_DROPDOWN.replace(/outer/g, 'second')}`);
			firstEvents = recordEvents('#first');
			secondEvents = recordEvents('#second');
			await setOpen('#first', true);
			await setOpen('#second', true);
		});

		it('should only ask the most recently opened one to close, and mark the Escape as handled', async () => {
			const event = await pressEscape();

			expect(secondEvents).toEqual([['openStateChange', false]]);
			expect(firstEvents).toEqual([]);
			expect(event.defaultPrevented).toBe(true);
		});

		it('should ask the one opened before to close once the last one has closed', async () => {
			await pressEscape();
			await setOpen('#second', false);

			await pressEscape();

			expect(secondEvents).toEqual([['openStateChange', false]]);
			expect(firstEvents).toEqual([['openStateChange', false]]);
		});

		it('should take the one opened again for the most recently opened', async () => {
			await setOpen('#first', false);
			await setOpen('#first', true);

			await pressEscape();

			expect(firstEvents).toEqual([['openStateChange', false]]);
			expect(secondEvents).toEqual([]);
		});

		it('should not ask any to close on an Escape handled already', async () => {
			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true });
			page.body.addEventListener('keydown', handledEvent => handledEvent.preventDefault());
			page.body.dispatchEvent(event);
			await page.waitForChanges();

			expect(firstEvents).toEqual([]);
			expect(secondEvents).toEqual([]);
		});

		it('should not ask any to close on an Escape composing a character', async () => {
			const event = await pressEscape({ isComposing: true });

			expect(firstEvents).toEqual([]);
			expect(secondEvents).toEqual([]);
			expect(event.defaultPrevented).toBe(false);
		});

		it('should not ask any to close on another key', async () => {
			getElement('#second').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
			await page.waitForChanges();

			expect(firstEvents).toEqual([]);
			expect(secondEvents).toEqual([]);
		});

		it('should keep the ones opened before open when the last one has escapeClose off', async () => {
			getElement<HTMLKvDropdownBaseElement>('#second').escapeClose = false;
			await page.waitForChanges();

			const event = await pressEscape();

			expect(secondEvents).toEqual([]);
			expect(firstEvents).toEqual([]);
			expect(event.defaultPrevented).toBe(false);
		});

		it('should no longer count one that has been removed', async () => {
			getElement('#second').remove();
			await page.waitForChanges();

			await pressEscape();

			expect(firstEvents).toEqual([['openStateChange', false]]);
		});
	});

	describe('when a dropdown is open from the start', () => {
		it('should ask it to close on Escape', async () => {
			await renderDropdowns(OUTER_DROPDOWN.replace('<kv-dropdown-base id="outer">', '<kv-dropdown-base id="outer" is-open>'));
			const events = recordEvents('#outer');

			await pressEscape();

			expect(events).toEqual([['openStateChange', false]]);
		});
	});
});

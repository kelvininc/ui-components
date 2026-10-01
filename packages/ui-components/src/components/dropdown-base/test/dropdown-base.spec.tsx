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
});

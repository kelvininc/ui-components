import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvPortal } from '../portal';
import { PORTAL_Z_INDEX } from '../portal.config';

const getPortalElement = (page: SpecPage): HTMLElement => page.doc.getElementById('kv-portal');

describe('Portal (unit tests)', () => {
	let page: SpecPage;

	const openPortal = async (zIndex: unknown) => {
		page = await newSpecPage({ components: [KvPortal], html: `<kv-portal></kv-portal>` });
		// Mirrors what the React wrapper's `attachProps` does: it assigns every prop
		// with `node[name] = newProps[name]`, so an undefined `zIndex` clobbers the
		// `@Prop` default instead of leaving it in place.
		(page.root as unknown as Record<string, unknown>).zIndex = zIndex;
		(page.root as HTMLKvPortalElement).show = true;
		await page.waitForChanges();
	};

	describe('when opened with a valid z-index', () => {
		beforeEach(() => openPortal(4000));

		it('should apply it to the portal element', () => {
			expect(getPortalElement(page).style.zIndex).toBe('4000');
		});
	});

	describe('when opened with no z-index', () => {
		beforeEach(() => openPortal(undefined));

		// Writing `${undefined}` produces the string "undefined", which is invalid CSS
		// and is silently dropped by the browser. The portal then keeps the `-1` that
		// `createPortal()` set, so the content renders correctly positioned but behind
		// the whole page, with no error to point at.
		it('should never write the literal string "undefined"', () => {
			expect(getPortalElement(page).style.zIndex).not.toBe('undefined');
		});

		it('should fall back to the default z-index', () => {
			expect(getPortalElement(page).style.zIndex).toBe(`${PORTAL_Z_INDEX.show}`);
		});

		it('should not leave the portal behind the page', () => {
			expect(Number(getPortalElement(page).style.zIndex)).toBeGreaterThan(0);
		});
	});

	describe.each([
		['null', null],
		['a non numeric string', 'auto'],
		['NaN', NaN]
	])('when opened with %s as z-index', (_label, zIndex) => {
		beforeEach(() => openPortal(zIndex));

		it('should fall back to the default z-index', () => {
			expect(getPortalElement(page).style.zIndex).toBe(`${PORTAL_Z_INDEX.show}`);
		});
	});

	describe('when closed', () => {
		beforeEach(async () => {
			await openPortal(undefined);
			(page.root as HTMLKvPortalElement).show = false;
			await page.waitForChanges();
		});

		it('should hide the portal behind the page', () => {
			expect(getPortalElement(page).style.zIndex).toBe(`${PORTAL_Z_INDEX.hidden}`);
		});
	});
});

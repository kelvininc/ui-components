import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { KvSelect } from '../select';
import { hasSlottedContent } from '../select.helper';

const getActionsRow = (host: HTMLElement) => host.shadowRoot.querySelector('.footer-actions');

describe('select header actions slot', () => {
	it('shows the actions row for slotted actions alone, with no built-in action on', async () => {
		const page = await newSpecPage({
			components: [KvSelect],
			template: () => (
				<kv-select>
					<button slot="select-header-actions">Clear option</button>
				</kv-select>
			)
		});

		expect(getActionsRow(page.root)).not.toBeNull();
		expect(getActionsRow(page.root).querySelector('slot[name="select-header-actions"]')).not.toBeNull();
	});

	it('shows no actions row when the slot is empty or its content hidden', async () => {
		const page = await newSpecPage({
			components: [KvSelect],
			template: () => (
				<kv-select>
					<button slot="select-header-actions" hidden>
						Clear option
					</button>
				</kv-select>
			)
		});

		expect(getActionsRow(page.root)).toBeNull();
	});

	it('redraws when what the slot holds changes', async () => {
		const page = await newSpecPage({ components: [KvSelect], template: () => <kv-select /> });
		expect(getActionsRow(page.root)).toBeNull();

		const action = page.doc.createElement('button');
		action.setAttribute('slot', 'select-header-actions');
		page.root.appendChild(action);
		page.root.dispatchEvent(new Event('slotchange'));
		await page.waitForChanges();

		expect(getActionsRow(page.root)).not.toBeNull();
	});
});

describe('hasSlottedContent', () => {
	const element = (attributes: { slot?: string; hidden?: boolean; tagName?: string; assigned?: Element[] }) =>
		({
			tagName: attributes.tagName ?? 'DIV',
			hidden: attributes.hidden ?? false,
			getAttribute: (name: string) => (name === 'slot' ? (attributes.slot ?? null) : null),
			assignedElements: () => attributes.assigned ?? []
		}) as unknown as HTMLElement;
	const host = (...children: HTMLElement[]) => ({ children }) as unknown as HTMLElement;

	it('reads what a forwarded slot carries, never the slot itself', () => {
		const forwarded = (assigned: Element[]) => element({ slot: 'actions', tagName: 'SLOT', assigned });

		expect(hasSlottedContent(host(forwarded([])), 'actions')).toBe(false);
		expect(hasSlottedContent(host(forwarded([element({})])), 'actions')).toBe(true);
	});

	it('counts only the named slot, and no hidden content', () => {
		expect(hasSlottedContent(host(element({ slot: 'other' })), 'actions')).toBe(false);
		expect(hasSlottedContent(host(element({ slot: 'actions', hidden: true })), 'actions')).toBe(false);
		expect(hasSlottedContent(host(element({ slot: 'actions' })), 'actions')).toBe(true);
	});
});

import { SpecPage } from '@stencil/core/internal';
import { KvActionButtonSplit } from '../action-button-split';
import { newSpecPage } from '@stencil/core/testing';
import { EComponentSize } from '../../../utils/types';
import { KvActionButton } from '../../action-button/action-button';
import { KvActionButtonText } from '../../action-button-text/action-button-text';

describe('Action Button Split (unit tests)', () => {
	let page: SpecPage;
	let component: KvActionButtonSplit;

	it.each([
		{ attributes: '', left: null, right: 'More options' },
		{ attributes: 'accessible-label="Deploy connector" split-accessible-label="Deployment options"', left: 'Deploy connector', right: 'Deployment options' }
	])('should forward the names of both split controls: $right', async ({ attributes, left, right }) => {
		page = await newSpecPage({
			components: [KvActionButtonSplit, KvActionButtonText, KvActionButton],
			html: `<kv-action-button-split type="primary" text="Deploy" split-icon="kv-arrow-drop-down" ${attributes}></kv-action-button-split>`
		});
		const primary = page.root?.shadowRoot?.querySelector('kv-action-button-text')?.shadowRoot?.querySelector('kv-action-button')?.shadowRoot?.querySelector('[part="button"]');
		const secondary = page.root?.shadowRoot?.querySelector('div.action-button-split > kv-action-button')?.shadowRoot?.querySelector('[part="button"]');

		expect(primary?.getAttribute('role')).toBe('button');
		expect(primary?.getAttribute('aria-label')).toBe(left);
		expect(secondary?.getAttribute('role')).toBe('button');
		expect(secondary?.getAttribute('aria-label')).toBe(right);
	});

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonSplit],
				html: '<kv-action-button-split type="primary" text="Split Button" split-button="kv-arrow-drop-down"></kv-action-button-split>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `disabled` with false', () => {
			expect(component.disabled).toBe(false);
		});

		it('should initialize `icon` with undefined', () => {
			expect(component.icon).toBeUndefined();
		});

		it('should initialize `size` with large', () => {
			expect(component.size).toBe(EComponentSize.Large);
		});
	});

	describe('when has a icon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonSplit],
				html: '<kv-action-button-split type="primary" text="Split Button" split-button="kv-arrow-drop-down" icon="kv-add"></kv-action-button-split>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});

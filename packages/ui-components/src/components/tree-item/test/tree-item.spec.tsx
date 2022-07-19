import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvTreeItem } from '../tree-item';

describe('Tree Item (unit tests)', () => {
	let page: SpecPage;
	let component: KvTreeItem;

	describe('when initialized with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTreeItem],
				html: `<kv-tree-item label="Node Title"></kv-tree-item>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the label prop value', () => {
			expect(component.label).toEqual('Node Title');
		});
	});

	describe('when initialized with disabled attribute', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTreeItem],
				html: `<kv-tree-item label="Node Title" disabled></kv-tree-item>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the disabled prop value', () => {
			expect(component.disabled).toBeTruthy();
		});
	});

	describe('when initialized with selected attribute', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTreeItem],
				html: `<kv-tree-item label="Node Title" selected></kv-tree-item>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the selected prop value', () => {
			expect(component.selected).toBeTruthy();
		});
	});

	describe('when initialized with counter attribute', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTreeItem],
				html: `<kv-tree-item label="Node Title" counter="32"></kv-tree-item>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the counter prop value', () => {
			expect(component.counter).toEqual(32);
		});
	});

	describe('when initialized with preventDefault prop', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTreeItem],
				html: '<kv-tree-item label="Node Title" prevent-default="true"></kv-tree-item>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		describe('and onItemClick is called', () => {
			let onClickSpyEvent: MouseEvent;

			beforeEach(() => {
				onClickSpyEvent = new MouseEvent('click');
				component.onItemClick(onClickSpyEvent);
			});

			it('should prevent event', () => {
				expect(onClickSpyEvent.defaultPrevented).toBeTruthy();
			});
		});
	});
});

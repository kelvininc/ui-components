import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvTabItem } from '../tab-item';

describe('Tab Item (unit tests)', () => {
	let page: SpecPage;
	let component: KvTabItem;

	describe('when initialized with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTabItem],
				html: `<kv-tab-item tab-key="dashboard" label="Dashboard"></kv-tab-item>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the tabKey prop value', () => {
			expect(component.tabKey).toEqual('dashboard');
		});

		it('should set the label prop value', () => {
			expect(component.label).toEqual('Dashboard');
		});
	});

	describe('when initialized with disabled attribute', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTabItem],
				html: `<kv-tab-item tab-key="dashboard" label="Dashboard" disabled></kv-tab-item>`
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
				components: [KvTabItem],
				html: `<kv-tab-item tab-key="dashboard" label="Dashboard" selected></kv-tab-item>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the disabled prop value', () => {
			expect(component.selected).toBeTruthy();
		});
	});

	describe('when initialized with notification-color attribute', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTabItem],
				html: `<kv-tab-item tab-key="dashboard" label="Dashboard" notification-color="#EFEFEF"></kv-tab-item>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the notificationColor prop value', () => {
			expect(component.notificationColor).toEqual('#EFEFEF');
		});
	});
});

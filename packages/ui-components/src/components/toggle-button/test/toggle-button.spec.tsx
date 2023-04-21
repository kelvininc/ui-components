import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvToggleButton } from '../toggle-button';

describe('Toggle Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvToggleButton;

	describe('when the component loads with label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleButton],
				html: '<kv-toggle-button label="Option 1" value="opt1"></kv-toggle-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the component loads with icon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleButton],
				html: '<kv-toggle-button icon="kv-add" value="opt1"></kv-toggle-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the component loads with label and icon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleButton],
				html: '<kv-toggle-button label="Add item" icon="kv-add" value="opt1"></kv-toggle-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the component loads with disabled prop', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleButton],
				html: '<kv-toggle-button label="Option 1" value="opt1" disabled></kv-toggle-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the component loads with checked prop', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleButton],
				html: '<kv-toggle-button label="Option 1" value="opt1" checked></kv-toggle-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the component loads with preventDefault prop', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleButton],
				html: '<kv-toggle-button label="Option 1" value="opt1" prevent-default="true"></kv-toggle-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		describe('and onClick is called', () => {
			let onClickSpyEvent: MouseEvent;

			beforeEach(() => {
				onClickSpyEvent = new MouseEvent('click');
				component.onClick(onClickSpyEvent);
			});

			it('should prevent event', () => {
				expect(onClickSpyEvent.defaultPrevented).toBeTruthy();
			});
		});
	});
});

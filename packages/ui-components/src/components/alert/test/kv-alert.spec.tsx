import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvAlert } from '../alert';

describe('Alert (unit tests', () => {
	let page: SpecPage;

	describe('when using required props and defaults', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAlert],
				html: '<kv-alert type="info" label="Main Message" />'
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when using required props and description', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAlert],
				html: '<kv-alert type="info" label="Main Message" description="Secondary Message" />'
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when using required props and showIcon `false`', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAlert],
				html: '<kv-alert type="info" label="Main Message" show-icon="false" />'
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when closable is true', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAlert],
				html: '<kv-alert type="info" label="Main Message" closable />'
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should render the close button', () => {
			const closeButton = page.root.shadowRoot.querySelector('.close-button');
			expect(closeButton).not.toBeNull();
		});

		it('should emit clickCloseButton when close button is clicked', async () => {
			const spy = jest.fn();
			page.root.addEventListener('clickCloseButton', spy);

			const closeButton = page.root.shadowRoot.querySelector<HTMLElement>('.close-button');
			closeButton.click();
			await page.waitForChanges();

			expect(spy).toHaveBeenCalledTimes(1);
		});
	});
});

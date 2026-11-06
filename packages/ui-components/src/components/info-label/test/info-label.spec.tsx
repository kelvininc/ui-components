// mock-doc has no layout, so ResizeSensor is mocked; kept above the imports since Stencil's Jest transform doesn't hoist jest.mock
jest.mock('css-element-queries', () => ({ ResizeSensor: jest.fn(() => ({ reset: jest.fn(), detach: jest.fn() })) }));

import { SpecPage } from '@stencil/core/internal';
import { KvInfoLabel } from '../info-label';
import { newSpecPage } from '@stencil/core/testing';
import { KvTag } from '../../tag/tag';
import { ResizeSensor } from 'css-element-queries';

describe('Info Label (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInfoLabel],
				html: `<kv-info-label label-text="Default" />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when renders with description and read more stuffs', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInfoLabel],
				html: `<kv-info-label
							label-title="DESCRIPTION"
							description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
							description-height="34"
							description-collapsed-text="Read more"
							description-opened-text="Read less"
							show-text-shadow="true"
						/>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the content resizes', () => {
		const resizeSensor = ResizeSensor as unknown as jest.Mock;
		let contentHeight: number;
		beforeEach(() => resizeSensor.mockClear());
		const wrapperHeight = () => (page.root.shadowRoot.querySelector('.description-wrapper') as HTMLElement).style.height;
		const toggle = () => (page.root.shadowRoot.querySelector('.expand-description-button') as HTMLElement).click();
		const resize = async (height: number) => {
			contentHeight = height;
			resizeSensor.mock.lastCall[1]();
			await page.waitForChanges();
		};
		const render = async (descriptionHeight: number) => {
			page = await newSpecPage({
				components: [KvInfoLabel],
				html: `<kv-info-label description="Long payload" description-height="${descriptionHeight}" />`
			});
			Object.defineProperty(page.root.shadowRoot.querySelector('.description'), 'clientHeight', { get: () => contentHeight });
			await resize(420);
		};

		it('should follow the content height while expanded and return to the cap when collapsed', async () => {
			await render(40);
			expect(wrapperHeight()).toBe('40px');

			toggle();
			await page.waitForChanges();
			expect(wrapperHeight()).toBe('420px');

			// Content grows while expanded, e.g. it rewraps when the container narrows
			await resize(560);
			expect(wrapperHeight()).toBe('560px');

			toggle();
			await page.waitForChanges();
			expect(wrapperHeight()).toBe('40px');
		});

		it('should clear the height and hide the button when the content fits the cap', async () => {
			await render(40);
			toggle();
			await page.waitForChanges();

			await resize(30);
			expect(wrapperHeight()).toBe('');
			expect(page.root.shadowRoot.querySelector('.expand-description-button')).toBeNull();
		});

		it('should fully hide and fully open with a zero cap', async () => {
			await render(0);
			expect(wrapperHeight()).toBe('0px');

			toggle();
			await page.waitForChanges();
			await resize(560);
			expect(wrapperHeight()).toBe('560px');
		});

		it('should recalculate the cap when descriptionHeight changes', async () => {
			await render(40);
			const button = () => page.root.shadowRoot.querySelector('.expand-description-button');
			expect(button()).not.toBeNull();

			page.root.descriptionHeight = 500;
			await page.waitForChanges();
			expect(wrapperHeight()).toBe('');
			expect(button()).toBeNull();

			page.root.descriptionHeight = 100;
			await page.waitForChanges();
			expect(wrapperHeight()).toBe('100px');
			expect(button()).not.toBeNull();

			page.root.descriptionHeight = undefined;
			await page.waitForChanges();
			expect(wrapperHeight()).toBe('');
			expect(button()).toBeNull();
		});

		it('should attach a single resize sensor across renders', async () => {
			await render(40);
			toggle();
			await page.waitForChanges();
			toggle();
			await page.waitForChanges();
			expect(resizeSensor).toHaveBeenCalledTimes(1);
			expect(resizeSensor).toHaveBeenCalledWith(page.root.shadowRoot.querySelector('.description'), expect.any(Function));
		});

		it('should detach on removal and re-attach after reconnecting', async () => {
			await render(40);
			const host = page.root;
			host.remove();
			await page.waitForChanges();
			expect(resizeSensor.mock.results[0].value.detach).toHaveBeenCalled();

			page.body.appendChild(host);
			host.description = 'Longer payload';
			await page.waitForChanges();
			expect(resizeSensor).toHaveBeenCalledTimes(2);
		});
	});

	describe('when renders with copy values props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInfoLabel],
				html: '<kv-info-label label-title="TYPE" description="data-model" copy-value="data-model" />'
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when renders with a component', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInfoLabel, KvTag],
				html: '<kv-info-label label-title="DESCRIPTION"><kv-tag label="Test" /></kv-info-label>'
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});

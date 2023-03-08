import { h } from '@stencil/core';
import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvDescriptionList } from '../description-list';
import { DEFAULT_CONFIG, WITH_ICON_TOOLTIP, WITH_TEXT_TOOLTIP } from './description-list.mock';

describe('Description List (unit tests)', () => {
	let page: SpecPage;

	describe('when rendering with required item props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvDescriptionList],
				template: () => <kv-description-list items={DEFAULT_CONFIG} />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when rendering with an item with text tooltip', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvDescriptionList],
				template: () => <kv-description-list items={WITH_TEXT_TOOLTIP} />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when rendering with an item with icon tooltip', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvDescriptionList],
				template: () => <kv-description-list items={WITH_ICON_TOOLTIP} />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});

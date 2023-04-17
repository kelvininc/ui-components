import { SpecPage, h } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvRadioList } from '../radio-list';
import { DISABLED_OPTIONS_MOCK, OPTIONS_MOCK } from './radio-list.mock';

describe('Radio List (unit tests)', () => {
	let page: SpecPage;

	describe('when passing required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioList],
				template: () => <kv-radio-list options={OPTIONS_MOCK} />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and form label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioList],
				template: () => <kv-radio-list options={OPTIONS_MOCK} label={'Choose an option'} required />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and `selectedOption`', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioList],
				template: () => <kv-radio-list options={OPTIONS_MOCK} selectedOption={'k3s'} />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and `disabledOptions`', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioList],
				template: () => <kv-radio-list options={OPTIONS_MOCK} disabledOptions={DISABLED_OPTIONS_MOCK} />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});

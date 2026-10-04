import { SpecPage, h } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvRadioList } from '../radio-list';
import { KvRadioListItem } from '../../radio-list-item/radio-list-item';
import { DISABLED_OPTIONS_MOCK, OPTIONS_MOCK } from './radio-list.mock';

describe('radio group Tab policy', () => {
	it.each([
		{ name: 'selected enabled', selected: 'alarms', disabled: {}, stops: [true, false, true] },
		{ name: 'disabled selected', selected: 'alarms', disabled: { alarms: true }, stops: [false, true, true] },
		{ name: 'all disabled', selected: 'alarms', disabled: { telemetry: true, alarms: true, commands: true }, stops: [true, true, true] }
	])('sets one enabled Tab stop for $name options', async ({ selected, disabled, stops }) => {
		const options = ['telemetry', 'alarms', 'commands'].map(optionId => ({ optionId, label: optionId }));
		const page = await newSpecPage({
			components: [KvRadioList, KvRadioListItem],
			template: () => <kv-radio-list options={options} selectedOption={selected} disabledOptions={disabled} />
		});
		expect(Array.from(page.root.shadowRoot.querySelectorAll('kv-radio-list-item')).map(item => item.skipTabStop)).toEqual(stops);
		expect(page.root.shadowRoot.querySelector('[role="radiogroup"]')).not.toBeNull();
	});
});

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

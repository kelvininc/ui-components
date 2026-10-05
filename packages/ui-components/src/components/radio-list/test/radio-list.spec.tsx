import { SpecPage, h } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvRadioList } from '../radio-list';
import { KvRadioListItem } from '../../radio-list-item/radio-list-item';
import { DISABLED_OPTIONS_MOCK, OPTIONS_MOCK } from './radio-list.mock';

describe('radio group announcements', () => {
	it.each([
		{ name: 'visible fallback', label: 'Topics', accessibleLabel: undefined, expected: 'Topics' },
		{ name: 'assistive only', label: undefined, accessibleLabel: 'Connection topics', expected: 'Connection topics' },
		{ name: 'assistive override', label: 'Topics', accessibleLabel: 'Connection topics', expected: 'Connection topics' }
	])('names the native group through $name', async ({ label, accessibleLabel, expected }) => {
		const page = await newSpecPage({
			components: [KvRadioList],
			html: `<kv-radio-list ${label ? `label="${label}"` : ''} ${accessibleLabel ? `accessible-label="${accessibleLabel}"` : ''}></kv-radio-list>`
		});
		expect(page.root.shadowRoot.querySelector('[role="radiogroup"]').getAttribute('aria-label')).toBe(expected);
		expect(Boolean(page.root.shadowRoot.querySelector('kv-form-label'))).toBe(Boolean(label));
		expect(page.root.shadowRoot.querySelector('kv-form-label')?.getAttribute('label')).toBe(label);
	});

	it('updates an assistive name and restores the visible name when cleared', async () => {
		const page = await newSpecPage({ components: [KvRadioList], html: '<kv-radio-list label="Topics" accessible-label="Connection topics"></kv-radio-list>' });
		const group = page.root.shadowRoot.querySelector('[role="radiogroup"]');
		page.root.setAttribute('accessible-label', 'Selected topics');
		await page.waitForChanges();
		expect(group.getAttribute('aria-label')).toBe('Selected topics');
		page.root.setAttribute('accessible-label', '');
		await page.waitForChanges();
		expect(group.getAttribute('aria-label')).toBe('Topics');
		page.root.removeAttribute('accessible-label');
		await page.waitForChanges();
		expect(group.getAttribute('aria-label')).toBe('Topics');
	});

	it('announces required and invalid on the group and clears both states', async () => {
		const page = await newSpecPage({ components: [KvRadioList], html: '<kv-radio-list accessible-label="Connection topics" required invalid></kv-radio-list>' });
		const group = page.root.shadowRoot.querySelector('[role="radiogroup"]');
		expect(group.getAttribute('aria-required')).toBe('true');
		expect(group.getAttribute('aria-invalid')).toBe('true');
		page.root.removeAttribute('required');
		page.root.removeAttribute('invalid');
		await page.waitForChanges();
		expect(group.hasAttribute('aria-required')).toBe(false);
		expect(group.hasAttribute('aria-invalid')).toBe(false);
	});
});

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

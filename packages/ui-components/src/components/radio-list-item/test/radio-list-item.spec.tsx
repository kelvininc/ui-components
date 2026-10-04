import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvRadioListItem } from '../radio-list-item';

describe('radio list item activation', () => {
	it('emits one selection for a bubbling mouse click', async () => {
		const page = await newSpecPage({ components: [KvRadioListItem], html: '<kv-radio-list-item option-id="telemetry" label="Telemetry" />' });
		const select = jest.fn();
		page.root.addEventListener('optionClick', select);
		const radio = page.root.shadowRoot.querySelector('kv-radio');
		radio.dispatchEvent(new CustomEvent('checkedChange', { detail: new MouseEvent('click'), bubbles: true }));
		radio.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(select).toHaveBeenCalledTimes(1);
		expect(select.mock.calls[0][0].detail).toBe('telemetry');
	});
});
import { KvRadio } from '../../radio/radio';

describe('Radio List Item (unit tests)', () => {
	let page: SpecPage;

	describe('when passing required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioListItem],
				html: `<kv-radio-list-item option-id='k3s' label='K3S' />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and a description', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioListItem],
				html: `<kv-radio-list-item option-id='k3s' label='K3S' description='Check the [documentation](https://docs.kelvininc.com/4.10.2/) here.' />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and `checked` true', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioListItem],
				html: `<kv-radio-list-item option-id='k3s' label='K3S' checked=true />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and `disabled` true', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioListItem],
				html: `<kv-radio-list-item option-id='k3s' label='K3S' disabled=true />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('accessibility', () => {
		it('names its radio with the label and hides the visible copy from assistive tech', async () => {
			page = await newSpecPage({ components: [KvRadioListItem, KvRadio], html: '<kv-radio-list-item option-id="k3s" label="K3S"></kv-radio-list-item>' });
			const radio = page.root?.shadowRoot?.querySelector('kv-radio') as unknown as { accessibleLabel: string; skipTabStop: boolean };

			expect(radio.accessibleLabel).toBe('K3S');
			expect(radio.skipTabStop).toBe(false);
			expect(page.root?.shadowRoot?.querySelector('.label')?.getAttribute('aria-hidden')).toBe('true');
		});

		it('passes on whether Tab stops on it', async () => {
			page = await newSpecPage({ components: [KvRadioListItem, KvRadio], html: '<kv-radio-list-item option-id="k3s" label="K3S"></kv-radio-list-item>' });
			page.root!.skipTabStop = true;
			await page.waitForChanges();

			expect((page.root?.shadowRoot?.querySelector('kv-radio') as unknown as { skipTabStop: boolean }).skipTabStop).toBe(true);
		});

		it('leaves a slotted label readable when there is no label prop to name the radio', async () => {
			page = await newSpecPage({ components: [KvRadioListItem], html: '<kv-radio-list-item option-id="k3s"><span slot="label">K3S</span></kv-radio-list-item>' });

			expect(page.root?.shadowRoot?.querySelector('.label')?.hasAttribute('aria-hidden')).toBe(false);
		});
	});
});

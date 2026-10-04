import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvToggleButton } from '../toggle-button';
import { KvRadio } from '../../radio/radio';
import { ERadioControlType } from '../../radio/radio.types';

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

	describe('with a radio', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleButton, KvRadio],
				html: '<kv-toggle-button label="Last 24 hours" value="24h" with-radio></kv-toggle-button>'
			});
		});
		const radio = () => page.root?.shadowRoot?.querySelector('kv-radio');
		const radioEvent = (type: string) => radio()!.dispatchEvent(new CustomEvent('checkedChange', { detail: { type }, bubbles: true, composed: true }));

		it('names the radio after the toggle', () => {
			expect((radio() as unknown as { accessibleLabel: string }).accessibleLabel).toBe('Last 24 hours');
		});

		it("toggles on Space from the radio, and keeps the radio's own event inside", () => {
			const onCheckedChange = jest.fn();
			page.root!.addEventListener('checkedChange', onCheckedChange);

			radioEvent('keydown');

			expect(onCheckedChange).toHaveBeenCalledTimes(1);
			expect(onCheckedChange.mock.calls[0][0].detail).toBe('24h');
		});

		it("leaves clicks to the toggle's own click handler", () => {
			const onCheckedChange = jest.fn();
			page.root!.addEventListener('checkedChange', onCheckedChange);

			radioEvent('click');

			expect(onCheckedChange).not.toHaveBeenCalled();
		});

		it('toggles once per Space press when the key is held', async () => {
			const onCheckedChange = jest.fn(() => {
				page.root!.checked = !page.root!.checked;
			});
			page.root!.addEventListener('checkedChange', onCheckedChange);
			const control = radio()!.shadowRoot!.querySelector('[role="radio"]')!;
			const press = async (repeat: boolean) => {
				const event = new KeyboardEvent('keydown', { key: ' ', code: 'Space', repeat, bubbles: true, composed: true, cancelable: true });
				control.dispatchEvent(event);
				await page.waitForChanges();
				expect(event.defaultPrevented).toBe(true);
			};

			await press(false);
			expect(page.root!.checked).toBe(true);
			await press(true);
			expect(page.root!.checked).toBe(true);
			expect(onCheckedChange).toHaveBeenCalledTimes(1);
			await press(false);
			expect(page.root!.checked).toBe(false);
			expect(onCheckedChange).toHaveBeenCalledTimes(2);
		});

		it('is a radio to assistive tech by default', () => {
			const control = radio()!.shadowRoot!.querySelector('.circle');

			expect(control?.getAttribute('role')).toBe('radio');
			expect(control?.getAttribute('aria-label')).toBe('Last 24 hours');
		});

		it('is a checkbox to assistive tech when a checked toggle can be unchecked', async () => {
			page.root!.radioControlType = ERadioControlType.Checkbox;
			page.root!.checked = true;
			await page.waitForChanges();
			const control = radio()!.shadowRoot!.querySelector('.circle');

			expect(control?.getAttribute('role')).toBe('checkbox');
			expect(control?.getAttribute('aria-checked')).toBe('true');
		});
	});

	describe('with a radio and only an icon', () => {
		it('names the radio after the tooltip', async () => {
			page = await newSpecPage({
				components: [KvToggleButton, KvRadio],
				html: '<kv-toggle-button icon="kv-add" tooltip="Add asset" value="add" with-radio></kv-toggle-button>'
			});
			const control = page.root?.shadowRoot?.querySelector('kv-radio')?.shadowRoot?.querySelector('.circle');

			expect(control?.getAttribute('aria-label')).toBe('Add asset');
		});
	});
});

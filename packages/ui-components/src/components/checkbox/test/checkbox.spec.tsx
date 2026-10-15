import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvCheckbox } from '../checkbox';

describe('checkbox event payload', () => {
	it('forwards the original DOM event', async () => {
		const page = await newSpecPage({ components: [KvCheckbox], html: '<kv-checkbox label="TLS" />' });
		const change = jest.fn();
		page.root.addEventListener('clickCheckbox', change);
		const original = new KeyboardEvent('keydown', { code: 'Space' });
		page.root.shadowRoot.querySelector('kv-radio').dispatchEvent(new CustomEvent('checkedChange', { detail: original }));
		expect(change).toHaveBeenCalledTimes(1);
		expect(change.mock.calls[0][0].detail).toBe(original);
	});
});
import { KvRadio } from '../../radio/radio';

describe('Radio Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvCheckbox;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCheckbox],
				html: '<kv-checkbox></kv-checkbox>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `checked` with value false', () => {
			expect(component.checked).toBeFalsy();
		});

		it('should initialize `disabled` with value false', () => {
			expect(component.disabled).toBeFalsy();
		});

		it('should initialize `indeterminate` with empty string', () => {
			expect(component.indeterminate).toBeFalsy();
		});
	});

	describe('accessibility', () => {
		it('is announced as a checkbox, with its label, and as mixed when indeterminate', async () => {
			page = await newSpecPage({ components: [KvCheckbox, KvRadio], html: '<kv-checkbox label="Select all" indeterminate></kv-checkbox>' });
			const control = page.root?.shadowRoot?.querySelector('kv-radio')?.shadowRoot?.querySelector('.circle');

			expect(control?.getAttribute('role')).toBe('checkbox');
			expect(control?.getAttribute('aria-checked')).toBe('mixed');
			expect(control?.getAttribute('aria-label')).toBe('Select all');
		});

		it('takes an accessible name when it has no visible label, as in a table row', async () => {
			page = await newSpecPage({ components: [KvCheckbox, KvRadio], html: '<kv-checkbox checked></kv-checkbox>' });
			page.root!.accessibleLabel = 'Select row bp-469';
			await page.waitForChanges();
			const control = page.root?.shadowRoot?.querySelector('kv-radio')?.shadowRoot?.querySelector('.circle');

			expect(control?.getAttribute('aria-checked')).toBe('true');
			expect(control?.getAttribute('aria-label')).toBe('Select row bp-469');
		});

		it('toggles once when Space is held down, not on every key repeat', async () => {
			page = await newSpecPage({ components: [KvCheckbox, KvRadio], html: '<kv-checkbox label="Select all"></kv-checkbox>' });
			const onClickCheckbox = jest.fn();
			page.root!.addEventListener('clickCheckbox', onClickCheckbox);
			const control = page.root!.shadowRoot!.querySelector('kv-radio')!.shadowRoot!.querySelector('.circle')!;
			const keydowns = [false, true, true].map(repeat => new KeyboardEvent('keydown', { code: 'Space', key: ' ', repeat, bubbles: true, composed: true, cancelable: true }));

			keydowns.forEach(keydown => control.dispatchEvent(keydown));

			expect(onClickCheckbox).toHaveBeenCalledTimes(1);
			// The repeats still don't scroll the page
			keydowns.forEach(keydown => expect(keydown.defaultPrevented).toBe(true));
		});
	});
});

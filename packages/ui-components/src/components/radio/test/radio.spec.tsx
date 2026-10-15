import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvRadio } from '../radio';

describe('radio control defaults', () => {
	it('keeps a radio role when controlType is explicitly undefined', async () => {
		const page = await newSpecPage({ components: [KvRadio], html: '<kv-radio label="TLS" />' });
		page.root.controlType = undefined;
		await page.waitForChanges();
		expect(page.root.shadowRoot.querySelector('.circle').getAttribute('role')).toBe('radio');
	});

	it.each(['altKey', 'ctrlKey', 'metaKey', 'shiftKey'])('leaves Space with %s to the caller', async modifier => {
		const page = await newSpecPage({ components: [KvRadio], html: '<kv-radio label="TLS" />' });
		const change = jest.fn();
		page.root.addEventListener('checkedChange', change);
		const event = new KeyboardEvent('keydown', { code: 'Space', cancelable: true, bubbles: true, [modifier]: true });
		page.root.shadowRoot.querySelector('.circle').dispatchEvent(event);
		expect(change).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});
});

describe('Radio Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvRadio;

	describe('when the component loads with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadio],
				html: '<kv-radio></kv-radio>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `label` with empty string', () => {
			expect(component.label).toBeFalsy();
		});
	});

	describe('when the component loads with a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadio],
				html: '<kv-radio label="Accepted"></kv-radio>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `label` with empty string', () => {
			expect(component.label).toEqual('Accepted');
		});
	});

	describe('when the component loads with disabled prop', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadio],
				html: '<kv-radio disabled></kv-radio>'
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
				components: [KvRadio],
				html: '<kv-radio checked></kv-radio>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('accessibility', () => {
		const circle = () => page.root?.shadowRoot?.querySelector('.circle');

		it('exposes the circle as a named radio with its checked and disabled state', async () => {
			page = await newSpecPage({ components: [KvRadio], html: '<kv-radio label="Verify SSL" checked disabled></kv-radio>' });

			expect(circle()?.getAttribute('role')).toBe('radio');
			expect(circle()?.getAttribute('aria-checked')).toBe('true');
			expect(circle()?.getAttribute('aria-disabled')).toBe('true');
			expect(circle()?.getAttribute('aria-label')).toBe('Verify SSL');
		});

		it('takes its name from accessibleLabel when the visible label sits outside it', async () => {
			page = await newSpecPage({ components: [KvRadio], html: '<kv-radio></kv-radio>' });
			page.root!.accessibleLabel = 'Skip discovery: Yes';
			await page.waitForChanges();

			expect(circle()?.getAttribute('aria-checked')).toBe('false');
			expect(circle()?.getAttribute('aria-label')).toBe('Skip discovery: Yes');
		});
	});

	describe('as the base of other controls', () => {
		const circle = () => page.root?.shadowRoot?.querySelector('.circle');
		const render = async (props: Record<string, unknown>) => {
			page = await newSpecPage({ components: [KvRadio], html: '<kv-radio label="Select row"></kv-radio>' });
			Object.assign(page.root!, props);
			await page.waitForChanges();
		};

		it('reports a checkbox, with the mixed state, when used as one', async () => {
			await render({ controlType: 'checkbox', indeterminate: true });

			expect(circle()?.getAttribute('role')).toBe('checkbox');
			expect(circle()?.getAttribute('aria-checked')).toBe('mixed');
		});

		it('keeps the mixed state for checkboxes only', async () => {
			await render({ indeterminate: true, checked: true });

			expect(circle()?.getAttribute('role')).toBe('radio');
			expect(circle()?.getAttribute('aria-checked')).toBe('true');
		});

		it('leaves the Tab order when it is not the group stop', async () => {
			await render({ skipTabStop: true });

			expect(circle()?.getAttribute('tabindex')).toBe('-1');
		});

		it('hides the visible label copy from assistive tech, since it names the control', async () => {
			await render({});

			expect(page.root?.shadowRoot?.querySelector('.label')?.getAttribute('aria-hidden')).toBe('true');
			expect(circle()?.getAttribute('aria-label')).toBe('Select row');
		});

		it('selects on Space without scrolling the page', async () => {
			await render({});
			const onCheckedChange = jest.fn();
			page.root!.addEventListener('checkedChange', onCheckedChange);
			const space = new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true, composed: true, cancelable: true });

			circle()!.dispatchEvent(space);

			expect(onCheckedChange).toHaveBeenCalledTimes(1);
			expect(space.defaultPrevented).toBe(true);
		});

		it('selects once while Space is held down, ignoring the key repeats', async () => {
			await render({});
			const onCheckedChange = jest.fn();
			page.root!.addEventListener('checkedChange', onCheckedChange);
			const repeat = new KeyboardEvent('keydown', { code: 'Space', key: ' ', repeat: true, bubbles: true, composed: true, cancelable: true });

			circle()!.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true, composed: true, cancelable: true }));
			circle()!.dispatchEvent(repeat);

			expect(onCheckedChange).toHaveBeenCalledTimes(1);
			expect(repeat.defaultPrevented).toBe(true);
		});
	});
});

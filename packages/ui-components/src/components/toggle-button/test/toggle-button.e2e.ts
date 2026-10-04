import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('toggle radio name and event value', () => {
	it('names an icon-only radio by its tooltip and emits one value per mouse click', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-toggle-button with-radio value="telemetry" icon="kv-add" tooltip="Telemetry"></kv-toggle-button>');
		const spy = await (await page.find('kv-toggle-button')).spyOnEvent('checkedChange');
		const radio = await page.$('aria/Telemetry[role="radio"]');
		expect(radio).not.toBeNull();
		await radio.click();
		await page.waitForChanges();
		expect(spy.events).toHaveLength(1);
		expect(spy.lastEvent.detail).toBe('telemetry');
	});
});

describe('Toggle Button (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-toggle-button label="Option 1" value="opt1"></kv-toggle-button>');
		});

		it('should render a label', async () => {
			const labelComponent = await page.find('kv-toggle-button >>> .toggle-button');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText).toBe('Option 1');
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let toggleElement: E2EElement;

			beforeEach(async () => {
				toggleElement = await page.find('kv-toggle-button');
				spyCheckedChangeEvent = await toggleElement.spyOnEvent('checkedChange');

				const toggleBtn = await page.find('kv-toggle-button >>> .toggle-button');
				await toggleBtn.click();
				await new Promise(r => setTimeout(r, 300));
			});

			it('should emit state change with value `opt1`', () => {
				expect(spyCheckedChangeEvent).toHaveReceivedEventDetail('opt1');
			});
		});
	});

	describe('when rendering with icon props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-toggle-button icon="kv-add" value="opt1"></kv-toggle-button>');
		});

		it('should render a icon', async () => {
			const iconComponent = await page.find('kv-toggle-button >>> kv-icon');
			expect(iconComponent).toBeTruthy();
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let toggleElement: E2EElement;

			beforeEach(async () => {
				toggleElement = await page.find('kv-toggle-button');
				spyCheckedChangeEvent = await toggleElement.spyOnEvent('checkedChange');

				const toggleBtn = await page.find('kv-toggle-button >>> .toggle-button');
				await toggleBtn.click();
				await new Promise(r => setTimeout(r, 300));
			});

			it('should emit state change with value `opt1`', () => {
				expect(spyCheckedChangeEvent).toHaveReceivedEventDetail('opt1');
			});
		});
	});

	describe('when rendering with icon and label props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-toggle-button label="Add item" icon="kv-add" value="opt1"></kv-toggle-button>');
		});

		it('should render a label', async () => {
			const labelComponent = await page.find('kv-toggle-button >>> .toggle-button');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText).toBe('Add item');
		});

		it('should render a icon', async () => {
			const iconComponent = await page.find('kv-toggle-button >>> kv-icon');
			expect(iconComponent).toBeTruthy();
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let toggleElement: E2EElement;

			beforeEach(async () => {
				toggleElement = await page.find('kv-toggle-button');
				spyCheckedChangeEvent = await toggleElement.spyOnEvent('checkedChange');

				const toggleBtn = await page.find('kv-toggle-button >>> .toggle-button');
				await toggleBtn.click();
				await new Promise(r => setTimeout(r, 300));
			});

			it('should emit state change with value `opt1`', () => {
				expect(spyCheckedChangeEvent).toHaveReceivedEventDetail('opt1');
			});
		});
	});

	describe('when rendering with disabled prop', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-toggle-button label="Option 1" disabled></kv-toggle-button>');
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let toggleElement: E2EElement;

			beforeEach(async () => {
				toggleElement = await page.find('kv-toggle-button');
				spyCheckedChangeEvent = await toggleElement.spyOnEvent('checkedChange');

				const toggle = await page.find('kv-toggle-button >>> .toggle-button');
				await toggle.click();
				await new Promise(r => setTimeout(r, 300));
			});

			it('should not emit event', () => {
				expect(spyCheckedChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});

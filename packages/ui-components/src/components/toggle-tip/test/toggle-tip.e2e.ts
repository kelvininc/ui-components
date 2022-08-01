import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Toggle Tip (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders with text', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-toggle-tip text="toggletip"></kv-toggle-tip>');
		});

		it('should render a toggletip with text setted', async () => {
			const component = await page.find('kv-toggle-tip');
			expect(component).toBeTruthy();
			expect(component.getAttribute('position')).toBe(null);
			const textComponent = await page.find('kv-toggle-tip >>> .toggle-tip-container >>> .toggle-tip-text');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText.toLocaleLowerCase()).toBe('toggletip');
		});
	});

	describe('when it renders with position setted', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-toggle-tip text="toggletip" position="left"></kv-toggle-tip>');
		});

		it('should render a toggle tip with position selected', async () => {
			const component = await page.find('kv-toggle-tip');
			expect(component).toBeTruthy();
			expect(component.getAttribute('position')).toBe('left');
			const textComponent = await page.find('kv-toggle-tip >>> .toggle-tip-container >>> .toggle-tip-text');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText.toLocaleLowerCase()).toBe('toggletip');
		});
	});

	describe('when renders with position and text', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-toggle-tip text="toggletip" position="left"><kv-icon slot="open-element-slot" name="kv-logo-kelvin" ></kv-icon></kv-toggle-tip>');
		});

		describe('and user clicks on the icon to open the toggle tip', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const toggleTip = await page.find('kv-toggle-tip');
				spyChangeEvent = await toggleTip.spyOnEvent('openStateChange');

				const iconElement = await page.find('kv-toggle-tip >>> #toggle-tip-open-element-wrapper');
				await iconElement.click();
			});

			it('should emit openStateChange event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when renders with isFixed prop true', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(
				'<><div><h1>Outside</h1></div><kv-toggle-tip isFixed="true" isOpen="true" text="toggletip" position="left"><kv-icon slot="open-element-slot" name="kv-logo-kelvin" ></kv-icon></kv-toggle-tip></>'
			);
		});

		describe('and user clicks somewhere in the page', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const toggleTip = await page.find('kv-toggle-tip');
				spyChangeEvent = await toggleTip.spyOnEvent('openStateChange');
				const outsideDiv = await page.find('div');
				await outsideDiv.click();
			});

			it('should not emit openStateChange event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});

	describe('when toggle tip is disabled and user clicks in the icon', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(
				'<kv-toggle-tip disabled="true" isOpen="false" text="toggletip" position="left"><kv-icon slot="open-element-slot" name="kv-logo-kelvin" ></kv-icon></kv-toggle-tip>'
			);
		});

		describe('and user clicks to open the toggle tip', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const toggleTip = await page.find('kv-toggle-tip');
				spyChangeEvent = await toggleTip.spyOnEvent('openStateChange');

				const iconElement = await page.find('kv-toggle-tip >>> #toggle-tip-open-element-wrapper');
				await iconElement.click();
			});

			it('should not emit openStateChange event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});

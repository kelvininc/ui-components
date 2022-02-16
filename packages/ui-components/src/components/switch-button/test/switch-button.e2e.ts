import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

import { ESwitchButtonState } from '../switch-button.types';

describe('Switch Button (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-switch-button></kv-switch-button>');
		})

		it('should not render a label', async () => {
			const labelComponent = await page.find('kv-switch-button >>> .label')
			expect(labelComponent).toBeFalsy()
		});

		describe('and user clicks on the button', () => {
			let spyStateChangeEvent: EventSpy;
			let switchButtonElement: E2EElement;

			beforeEach(async () => {
				switchButtonElement = await page.find('kv-switch-button')
				spyStateChangeEvent = await switchButtonElement.spyOnEvent('switchStateChange');

				const buttonElement = await page.find('kv-switch-button >>> .switch-button');
				await buttonElement.click()
			})

			it('should change `state` to `ON`', async () => {
				expect(switchButtonElement).toHaveAttribute('state');
				expect(switchButtonElement).toEqualAttribute('state', ESwitchButtonState.ON)
			})

			it('should emit `true` state', () => {
				expect(spyStateChangeEvent).toHaveReceivedEventDetail(ESwitchButtonState.ON)
			});
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-switch-button label="Switch"></kv-switch-button>');
		})

		it('should render label', async () => {
			const labelComponent = await page.find('kv-switch-button >>> .label')
			expect(labelComponent).toBeTruthy()
			expect(labelComponent.innerText.toLocaleLowerCase()).toBe("switch")
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-switch-button disabled></kv-switch-button>');
		});

		describe('and user clicks on the button', () => {
			let spyStateChangeEvent: EventSpy;
			let switchButtonElement: E2EElement;

			beforeEach(async () => {
				switchButtonElement = await page.find('kv-switch-button')
				spyStateChangeEvent = await switchButtonElement.spyOnEvent('switchStateChange');
				const buttonElement = await page.find('kv-switch-button >>> .switch-button');
				await buttonElement.click()
			})

			it('should not change `state` to `ON`', async () => {
				expect(switchButtonElement).toEqualAttribute('state', ESwitchButtonState.OFF)
			})

			it('should not emit `true` state', () => {
				expect(spyStateChangeEvent).not.toHaveReceivedEvent()
			});
		})
	});

	describe('when is ON', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-switch-button state="on"></kv-switch-button>');
		});

		describe('and user clicks on the switch', () => {
			let spyStateChangeEvent: EventSpy;
			let switchButtonElement: E2EElement;

			beforeEach(async () => {
				switchButtonElement = await page.find('kv-switch-button')
				spyStateChangeEvent = await switchButtonElement.spyOnEvent('switchStateChange');

				const buttonElement = await page.find('kv-switch-button >>> .switch-button');
				await buttonElement.click()
			})

			it('should change `state` to `OFF`', async () => {
				expect(switchButtonElement).toHaveAttribute('state')
				expect(switchButtonElement).toEqualAttribute('state', ESwitchButtonState.OFF)
			})

			it('should emit `OFF` state', () => {
				expect(spyStateChangeEvent).toHaveReceivedEventDetail(ESwitchButtonState.OFF)
			});
		})
	});
});

import { EventSpy } from '@stencil/core/internal';
import { E2EPage, newE2EPage, E2EElement } from '@stencil/core/testing';

describe('Search (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search></kv-search>');
		});

		describe('and blur event is emitted', () => {
			let spyBlurEvent: EventSpy;
			let searchComponent: E2EElement;

			beforeEach(async () => {
				searchComponent = await page.find('kv-search');
				spyBlurEvent = await searchComponent.spyOnEvent('textFieldBlur');

				searchComponent.triggerEvent('textFieldBlur');

				await page.waitForChanges();
			});

			it('should emit blur event', () => {
				expect(spyBlurEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when value is defined', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value="Test to ixon"></kv-search>');
		});

		describe('and tries to press button', () => {
			let resetIcon: E2EElement;

			beforeEach(async () => {
				resetIcon = await page.find('kv-search >>> kv-text-field >>> .right-slot-container >>> kv-icon');
			});

			it('should find button', () => {
				expect(resetIcon).not.toBeNull();
			});
		});
	});

	describe('when renders with disable', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value="Test" input-disabled></kv-search>');
		});

		describe('when tries to press button', () => {
			let resetIcon: E2EElement;

			beforeEach(async () => {
				resetIcon = await page.find('kv-search >>> kv-text-field >>> .right-slot-container >>> kv-icon');
			});

			it('should not find button', () => {
				expect(resetIcon).toBeNull();
			});
		});
	});

	describe('when value is defined but its empty', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value=""></kv-search>');
		});

		describe('when tries to press button', () => {
			let resetIcon: E2EElement;

			beforeEach(async () => {
				resetIcon = await page.find('kv-search >>> kv-text-field >>> .right-slot-container >>> kv-icon');
			});

			it('should not find button', () => {
				expect(resetIcon).toBeNull();
			});
		});
	});

	describe('when value is kept in sync with textChange', () => {
		let input: E2EElement;
		let spyTextChange: EventSpy;

		const getResetIcon = () => page.find('kv-search >>> kv-text-field >>> .right-slot-container >>> kv-icon');

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value=""></kv-search>');
			await page.$eval('kv-search', element =>
				element.addEventListener('textChange', event => ((element as HTMLKvSearchElement).value = (event as CustomEvent<string>).detail))
			);

			const searchComponent = await page.find('kv-search');
			spyTextChange = await searchComponent.spyOnEvent('textChange');

			input = await page.find('kv-search >>> kv-text-field >>> input');
			await input.type('abc');
			await page.waitForChanges();
		});

		it('should render the reset icon once text is typed', async () => {
			expect(await getResetIcon()).not.toBeNull();
		});

		it('should clear the text when the reset icon is clicked', async () => {
			await (await getResetIcon()).click();
			await page.waitForChanges();

			expect(spyTextChange).toHaveReceivedEventDetail('');
			expect(await input.getProperty('value')).toBe('');
			expect(await getResetIcon()).toBeNull();
		});
	});
});

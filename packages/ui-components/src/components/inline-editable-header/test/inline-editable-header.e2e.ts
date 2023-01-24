import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('InlineEditableHeader (end-to-end)', () => {
	let page: E2EPage;

	describe('when displaying label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-inline-editable-header value="node-01"></kv-inline-editable-header>');
		});

		it('should render a div with the correct text', async () => {
			const label = await page.find('kv-inline-editable-header >>> .label');
			expect(label.innerText.toLowerCase()).toContain('node-01');
		});
	});

	describe('when displaying edit mode', () => {
		let hostEl: E2EElement;
		let buttons: E2EElement[];

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-inline-editable-header value="node-01" is-editing></kv-inline-editable-header>');
			buttons = await page.findAll('kv-inline-editable-header >>> kv-action-button-icon');
		});

		it('should render a text-field with the correct value', async () => {
			const textFieldEl = await page.find('kv-inline-editable-header >>> kv-text-field');
			expect(textFieldEl.getAttribute('value')).toContain('node-01');
		});

		describe('and confirming the changes', () => {
			let confirmSpy: EventSpy;

			beforeEach(async () => {
				hostEl = await page.find('kv-inline-editable-header');
				confirmSpy = await hostEl.spyOnEvent('changeConfirmed');
				await buttons[0].click();
			});

			it('should emit a changeConfirmed event', () => {
				expect(confirmSpy).toHaveReceivedEvent();
			});
		});

		describe('and discarding the changes', () => {
			let discardSpy: EventSpy;

			beforeEach(async () => {
				hostEl = await page.find('kv-inline-editable-header');
				discardSpy = await hostEl.spyOnEvent('changeDiscarded');
				await buttons[1].click();
			});

			it('should emit a changeConfirmed event', () => {
				expect(discardSpy).toHaveReceivedEvent();
			});
		});
	});
});

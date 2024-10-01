import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('KvInlineEditableField (e2e tests)', () => {
	describe('when the slot has 1 element', () => {
		let page: E2EPage;
		let component: E2EElement;
		let slot: E2EElement;
		let actionsEl: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage({ failOnConsoleError: true });
			await page.setContent(`
				<kv-inline-editable-field>
					<div>title</div>
				</kv-inline-editable-field>`);
			await page.waitForChanges();

			component = await page.find('kv-inline-editable-field');
			slot = await component.find('div');
			actionsEl = await component.find('.inline-editable-field-actions');
		});

		it('should render the component', async () => {
			expect(component).not.toBeNull();
		});

		it("should add 'inline-editable-field-slot' into slot class list", async () => {
			expect(slot.getAttribute('class')).toContain('inline-editable-field-slot');
		});

		it('should not render action buttons', async () => {
			const btns = await actionsEl.findAll('kv-action-button-icon');
			expect(btns.length).toBe(0);
		});

		describe('and focus the component', () => {
			let focusBtns: E2EElement[];

			beforeEach(async () => {
				await slot.focus();
				await page.waitForChanges();

				focusBtns = await actionsEl.findAll('kv-action-button-icon');
			});

			it('should render save and close buttons', () => {
				expect(focusBtns.length).toBe(2);
				expect(focusBtns[0].getAttribute('icon')).toBe('kv-close');
				expect(focusBtns[1].getAttribute('icon')).toBe('kv-done-all');
			});
		});
	});
});

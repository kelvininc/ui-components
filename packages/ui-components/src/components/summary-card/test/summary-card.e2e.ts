import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';
import { ESummaryCardType } from '../summary-card.types';

describe('KvSummaryCard (end-to-end)', () => {
	let page: E2EPage;

	describe('when the component renders with required props', () => {
		let labelEl: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`<kv-summary-card type=${ESummaryCardType.Text}></kv-summary-card>`);
			labelEl = await page.find('kv-summary-card >>> .label');
		});

		it('should render label with default value', () => {
			expect(labelEl.innerText).toContain('- -');
		});
	});

	describe('when the component renders with all optional props', () => {
		let labelEl: E2EElement;
		let subtitleEl: E2EElement;
		let descriptionEl: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-summary-card
					type=${ESummaryCardType.Text}
					label='Hello'
					subtitle='World'
					description='First Program'>
				</kv-summary-card>
			`);
			labelEl = await page.find('kv-summary-card >>> .label');
			subtitleEl = await page.find('kv-summary-card >>> .subtitle');
			descriptionEl = await page.find('kv-summary-card >>> .description');
		});

		it('should render label with provided value', () => {
			expect(labelEl.innerText).toContain('Hello');
		});

		it('should render subtitle with provided value', () => {
			expect(subtitleEl.innerText).toContain('World');
		});

		it('should render description with provided value', () => {
			expect(descriptionEl.innerText).toContain('First Program');
		});

		describe('and is loading', () => {
			let compWrapperEl: E2EElement;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent(`
					<kv-summary-card
						type=${ESummaryCardType.Text}
						label='Hello'
						subtitle='World'
						description='First Program'
						loading>
					</kv-summary-card>
				`);
				compWrapperEl = await page.find('kv-summary-card >>> .summary-card-container');
				labelEl = await page.find('kv-summary-card >>> .label');
				subtitleEl = await page.find('kv-summary-card >>> .subtitle');
				descriptionEl = await page.find('kv-summary-card >>> .description');
			});

			it('should not show any text', () => {
				expect(labelEl.innerText).toBeFalsy();
				expect(subtitleEl.innerText).toBeFalsy();
				expect(descriptionEl.innerText).toBeFalsy();
			});

			it('should apply the loading styling', () => {
				expect(compWrapperEl).toHaveClass('loading');
			});
		});
	});
});

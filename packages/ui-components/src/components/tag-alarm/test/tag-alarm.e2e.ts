import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Tag Alarm (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders with default text', () => {
		describe('when severity is level 1', () => {
			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-tag-alarm severity="1"></kv-tag-alarm>');
			});

			it('should render an alarm tag with severity one text', async () => {
				const textComponent = await page.find('kv-tag-alarm >>> .alarm-tag-label');
				expect(textComponent).toBeTruthy();
				expect(textComponent.innerText).toBe('Critical');
			});
		});

		describe('when severity is level 2', () => {
			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-tag-alarm severity="2"></kv-tag-alarm>');
			});

			it('should render an alarm tag with severity two text', async () => {
				const textComponent = await page.find('kv-tag-alarm >>> .alarm-tag-label');
				expect(textComponent).toBeTruthy();
				expect(textComponent.innerText).toBe('Urgent');
			});
		});

		describe('when severity is level 3', () => {
			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-tag-alarm severity="3"></kv-tag-alarm>');
			});

			it('should render an alarm tag with severity three text', async () => {
				const textComponent = await page.find('kv-tag-alarm >>> .alarm-tag-label');
				expect(textComponent).toBeTruthy();
				expect(textComponent.innerText).toBe('Advisory');
			});
		});

		describe('when severity is level 4', () => {
			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-tag-alarm severity="4"></kv-tag-alarm>');
			});

			it('should render an alarm tag with severity four text', async () => {
				const textComponent = await page.find('kv-tag-alarm >>> .alarm-tag-label');
				expect(textComponent).toBeTruthy();
				expect(textComponent.innerText).toBe('Medium');
			});
		});

		describe('when severity is level 5', () => {
			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-tag-alarm severity="5"></kv-tag-alarm>');
			});

			it('should render an alarm tag with severity five text', async () => {
				const textComponent = await page.find('kv-tag-alarm >>> .alarm-tag-label');
				expect(textComponent).toBeTruthy();
				expect(textComponent.innerText).toBe('Low');
			});
		});
	});

	describe('when it renders with custom label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag-alarm severity="1" label="Resolve now!"></kv-tag-alarm>');
		});

		it('should render an alarm tag with custom label', async () => {
			const textComponent = await page.find('kv-tag-alarm >>> .alarm-tag-label');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText).toBe('Resolve now!');
		});
	});
});

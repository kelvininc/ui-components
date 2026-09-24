import { SpecPage } from '@stencil/core/internal';
import { KvDateTimeInput } from '../date-time-input';
import { newSpecPage } from '@stencil/core/testing';

describe('Date Time Input (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvDateTimeInput],
				html: `<kv-date-time-input></kv-date-time-input>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvDateTimeInput],
				html: `<kv-date-time-input label="Date Time Label"></date-time-input>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the value is typed', () => {
		let input: HTMLInputElement;
		let textChange: jest.Mock;

		const type = (text: string) => {
			input.value = text;
			input.dispatchEvent(new Event('input'));
		};

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvDateTimeInput],
				html: `<kv-date-time-input value="15-03-2024 10:30:00"></kv-date-time-input>`
			});
			input = page.root.querySelector('input');
			textChange = jest.fn();
			page.root.addEventListener('textChange', (event: CustomEvent<string>) => textChange(event.detail));
		});

		it('should keep the newer text when a value typed before is sent back', async () => {
			type('15-03-2024 10:30:0');
			type('15-03-2024 10:30:');
			page.root.value = '15-03-2024 10:30:0';
			await page.waitForChanges();

			expect(input.value).toBe('15-03-2024 10:30:');
		});

		it('should replace the text with a value that was not typed', async () => {
			type('15-03-2024 10:30:0');
			page.root.value = '01-01-2024 00:00:00';
			await page.waitForChanges();

			expect(input.value).toBe('01-01-2024 00:00:00');
		});

		it('should report an edit back to the value', () => {
			type('15-03-2024 10:30:0');
			type('15-03-2024 10:30:00');

			expect(textChange.mock.calls).toEqual([['15-03-2024 10:30:0'], ['15-03-2024 10:30:00']]);
		});

		it('should not report a value that did not change', () => {
			type('15-03-2024 10:30:00');

			expect(textChange).not.toHaveBeenCalled();
		});

		it('should report text reverted without an input event, like Inputmask does on Escape', () => {
			type('15-03-2024 10:30:0');
			input.value = '15-03-2024 10:30:00';
			input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

			expect(textChange.mock.calls).toEqual([['15-03-2024 10:30:0'], ['15-03-2024 10:30:00']]);
		});

		it('should replace the text with a value typed before once the input loses focus', async () => {
			type('15-03-2024 10:30:0');
			type('15-03-2024 10:30:');
			input.dispatchEvent(new FocusEvent('blur'));
			page.root.value = '15-03-2024 10:30:0';
			await page.waitForChanges();

			expect(input.value).toBe('15-03-2024 10:30:0');
		});
	});
});

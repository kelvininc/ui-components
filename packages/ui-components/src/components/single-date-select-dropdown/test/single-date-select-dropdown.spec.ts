import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { formatDatetime } from '../../../utils/date.helper';
import { KvTextField } from '../../text-field/text-field';
import { KvSingleDateSelectDropdown } from '../single-date-select-dropdown';

describe('Single Date Input (unit tests)', () => {
	let page: SpecPage;
	let component: KvSingleDateSelectDropdown;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSingleDateSelectDropdown, KvTextField],
				html: '<kv-single-date-select-dropdown></kv-single-date-select-dropdown>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when `getFormattedSelectedDate` is called', () => {
		describe('and there is no selected date', () => {
			let result: string | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvSingleDateSelectDropdown, KvTextField],
					html: '<kv-single-date-select-dropdown></kv-single-date-select-dropdown>'
				});
				component = page.rootInstance;
				result = component.getFormattedSelectedDate();
			});

			it('should return undefined', () => {
				expect(result).toBeUndefined();
			});
		});

		describe('and there is a selected date', () => {
			describe('and a custom date mask is defined', () => {
				let result: string | undefined;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvSingleDateSelectDropdown, KvTextField],
						html: '<kv-single-date-select-dropdown selected-date="2022-04-01" date-mask="Do MMM, YYYY"></kv-single-date-select-dropdown>'
					});
					component = page.rootInstance;
					result = component.getFormattedSelectedDate();
				});

				it('should return an array with the selected date', () => {
					expect(result).toEqual('1st Apr, 2022');
				});
			});

			describe('and a custom date mask is not defined', () => {
				let result: string | undefined;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvSingleDateSelectDropdown, KvTextField],
						html: '<kv-single-date-select-dropdown selected-date="2022-04-01"></kv-single-date-select-dropdown>'
					});
					component = page.rootInstance;
					result = component.getFormattedSelectedDate();
				});

				it('should return an array with the selected date', () => {
					expect(result).toEqual('2022-04-01 00:00:00');
				});
			});
		});
	});
});

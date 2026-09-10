import { buildRangeSelection, getRangeOptionValues } from '../select-multi-options.helper';
import type { ISelectOptionWithChildren } from '../select-multi-options.types';

const createOption = (value: string): ISelectOptionWithChildren => ({
	label: value,
	value
});

describe('select-multi-options.helper', () => {
	describe('#getRangeOptionValues', () => {
		const options = ['option-1', 'option-2', 'option-3', 'option-4'].map(createOption);

		it('should return an inclusive range in forward visual order', () => {
			expect(getRangeOptionValues(options, 'option-2', 'option-4')).toEqual(['option-2', 'option-3', 'option-4']);
		});

		it('should return an inclusive range from the anchor toward a preceding endpoint', () => {
			expect(getRangeOptionValues(options, 'option-4', 'option-2')).toEqual(['option-4', 'option-3', 'option-2']);
		});

		it('should return an empty range when the anchor is not available', () => {
			expect(getRangeOptionValues(options, 'missing-option', 'option-2')).toEqual([]);
		});
	});

	describe('#buildRangeSelection', () => {
		it('should select the range and deselect the listed options outside it', () => {
			expect(
				buildRangeSelection({
					optionValues: ['option-2', 'option-3'],
					replaceableOptionValues: ['option-1', 'option-2', 'option-3', 'option-4'],
					selectedOptions: { 'option-1': true, 'option-4': true }
				})
			).toEqual({
				'option-2': true,
				'option-3': true
			});
		});

		it('should keep selections that are not currently listed', () => {
			expect(
				buildRangeSelection({
					optionValues: ['option-3', 'option-4'],
					replaceableOptionValues: ['option-3', 'option-4', 'option-5'],
					selectedOptions: { 'hidden-option': true, 'option-5': true }
				})
			).toEqual({
				'hidden-option': true,
				'option-3': true,
				'option-4': true
			});
		});

		it('should select from the anchor toward the endpoint until maxSelectable is reached', () => {
			expect(
				buildRangeSelection({
					optionValues: ['option-4', 'option-3', 'option-2'],
					replaceableOptionValues: ['option-2', 'option-3', 'option-4'],
					selectedOptions: { 'hidden-option': true, 'option-4': true },
					maxSelectable: 3
				})
			).toEqual({
				'hidden-option': true,
				'option-3': true,
				'option-4': true
			});
		});
	});
});

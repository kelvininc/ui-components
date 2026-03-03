import { getFlattenSelectOptions, getFlattenSelectOptionsArray } from './select.helper';
import { ISelectOptionsWithChildren } from '../types';
import { EToggleState } from '../components/select-option/select-option.types';

const createOption = (value: string, label: string, options?: ISelectOptionsWithChildren) => ({
	value,
	label,
	togglable: true,
	selected: false,
	state: EToggleState.None,
	highlighted: false,
	level: 0,
	heading: !!options,
	disabled: false,
	options: options ?? {}
});

describe('select.helper', () => {
	describe('#getFlattenSelectOptionsArray', () => {
		describe('when options is empty', () => {
			it('should return an empty array', () => {
				expect(getFlattenSelectOptionsArray({})).toEqual([]);
			});
		});

		describe('when options has flat items with string keys', () => {
			it('should return items preserving iteration order', () => {
				const options: ISelectOptionsWithChildren = {
					'option-a': createOption('option-a', 'Option A'),
					'option-b': createOption('option-b', 'Option B'),
					'option-c': createOption('option-c', 'Option C')
				};

				const result = getFlattenSelectOptionsArray(options);

				expect(result.map(o => o.value)).toEqual(['option-a', 'option-b', 'option-c']);
			});
		});

		describe('when options has nested children', () => {
			it('should flatten with parent before children', () => {
				const childOptions: ISelectOptionsWithChildren = {
					'child-1': createOption('child-1', 'Child 1'),
					'child-2': createOption('child-2', 'Child 2')
				};

				const options: ISelectOptionsWithChildren = {
					parent: createOption('parent', 'Parent', childOptions),
					sibling: createOption('sibling', 'Sibling')
				};

				const result = getFlattenSelectOptionsArray(options);

				expect(result.map(o => o.value)).toEqual(['parent', 'child-1', 'child-2', 'sibling']);
			});
		});

		describe('when options has nested children with numeric-like keys', () => {
			it('should keep children nested under their parent group', () => {
				// Note: JavaScript reorders numeric-like keys within each object level,
				// but the array flattening ensures children stay with their parent
				const childOptions: ISelectOptionsWithChildren = {
					'item-1000': createOption('item-1000', 'Item 1000'),
					'ccc': createOption('ccc', 'CCC')
				};

				const options: ISelectOptionsWithChildren = {
					'RELATED ASSETS': createOption('RELATED ASSETS', 'Related Assets'),
					'UNRELATED ASSETS': createOption('UNRELATED ASSETS', 'Unrelated Assets', childOptions)
				};

				const result = getFlattenSelectOptionsArray(options);

				// Children should appear after their parent
				expect(result.map(o => o.value)).toEqual(['RELATED ASSETS', 'UNRELATED ASSETS', 'item-1000', 'ccc']);
			});
		});

		describe('when using prefixed keys to avoid numeric reordering', () => {
			it('should preserve order with prefixed keys', () => {
				const options: ISelectOptionsWithChildren = {
					'group-a': createOption('group-a', 'Group A'),
					'id-98000': createOption('id-98000', '98000'),
					'group-b': createOption('group-b', 'Group B')
				};

				const result = getFlattenSelectOptionsArray(options);

				// With prefixed keys, order is preserved
				expect(result.map(o => o.value)).toEqual(['group-a', 'id-98000', 'group-b']);
			});
		});
	});

	describe('#getFlattenSelectOptions (object version)', () => {
		describe('when options has numeric-like keys', () => {
			it('should reorder numeric keys first due to JavaScript object behavior', () => {
				const options: ISelectOptionsWithChildren = {
					'group-a': createOption('group-a', 'Group A'),
					'98000': createOption('98000', '98000'),
					'group-b': createOption('group-b', 'Group B')
				};

				const result = getFlattenSelectOptions(options);
				const keys = Object.keys(result);

				// Object.keys puts numeric-like keys first - this is expected JavaScript behavior
				expect(keys[0]).toBe('98000');
			});
		});
	});
});

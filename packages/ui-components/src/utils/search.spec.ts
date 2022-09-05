import { searchString } from './search.helper';

interface IListItem {
	label: string;
	key: string;
}

const LIST: IListItem[] = [
	{ label: 'Rock', key: 'item-1' },
	{ label: 'Pop', key: 'item-2' },
	{ label: 'Jazz', key: 'item-3' }
];

describe('#searchString', () => {
	describe('when the search term is undefined', () => {
		it('should return a list', () => {
			expect(searchString(undefined, LIST)).toEqual(LIST);
		});
	});

	describe('when the search term is an empty string', () => {
		it('should return a list', () => {
			expect(searchString('', LIST)).toEqual(LIST);
		});
	});

	describe('when the search term is "azz"', () => {
		it('should return a list', () => {
			expect(searchString('azz', LIST)).toEqual([{ label: 'Jazz', key: 'item-3' }]);
		});
	});
});

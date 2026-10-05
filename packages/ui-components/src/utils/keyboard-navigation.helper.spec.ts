import { getNextEnabledIndex } from './keyboard-navigation.helper';

describe.each([
	{ name: 'empty', options: [], from: -1, step: 1, expected: -1 },
	{ name: 'all disabled', options: [{ disabled: true }, { disabled: true }], from: 0, step: 1, expected: -1 },
	{ name: 'first enabled', options: [{ disabled: true }, {}, {}], from: -1, step: 1, expected: 1 },
	{ name: 'last enabled', options: [{}, {}, { disabled: true }], from: -1, step: -1, expected: 1 },
	{ name: 'forward wrap', options: [{}, { disabled: true }, {}], from: 2, step: 1, expected: 0 },
	{ name: 'backward wrap', options: [{}, { disabled: true }, {}], from: 0, step: -1, expected: 2 },
	{ name: 'skip several disabled', options: [{}, { disabled: true }, { disabled: true }, {}], from: 0, step: 1, expected: 3 },
	{ name: 'single enabled', options: [{ disabled: true }, {}, { disabled: true }], from: 1, step: 1, expected: 1 },
	{ name: 'invalid origin', options: [{ disabled: true }, {}], from: 5, step: -1, expected: 1 }
])('enabled neighbor: $name', row => {
	it('chooses an enabled target or reports none', () => {
		expect(getNextEnabledIndex(row.options, row.from, row.step as 1 | -1)).toBe(row.expected);
	});
});

import { describe, expect, it } from 'vitest';
import { R5_ARRAY_ACTIONS, R5_TUPLE_FOCUS_CASES } from '../test-utils/matrix';
import { getArrayFocusTarget } from './useArrayFocus';

describe.each(R5_ARRAY_ACTIONS)('R5 array focus policy: $name', row => {
	it('selects the destination from the committed array state', () => {
		expect(getArrayFocusTarget(row.action, row.index, row.count, row.canAdd)).toEqual(row.target);
	});
});

describe.each(R5_TUPLE_FOCUS_CASES)('R5 tuple focus policy: $name', row => {
	it('skips fixed positions without item actions', () => {
		expect(getArrayFocusTarget('remove', row.index, row.count, row.canAdd, row.fixed)).toEqual(row.target);
	});
});

import { describe, expect, it } from 'vitest';
import { FIELD_WIDTH_SHAPES } from '../../test-utils/matrix';
import { fitWidth, toLength } from './utils';

describe.each(FIELD_WIDTH_SHAPES)('field width: $name', row => {
	it('reads bare numbers as pixels', () => expect(toLength(row.value)).toBe(row.length));
	it('caps lengths and preserves CSS keywords', () => expect(fitWidth(row.value)).toBe(row.fitted));
});

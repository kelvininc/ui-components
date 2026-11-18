import assert from 'node:assert/strict';
import test from 'node:test';

import { canonicalType } from './type-contracts.mjs';

test('should normalize nested property order without changing literal contents', () => {
	assert.equal(
		canonicalType('{ y: number; nested: { b: string; a: "two  spaces" }; x: number }'),
		canonicalType('{ x: number; nested: { a: "two  spaces"; b: string }; y: number }')
	);
	assert.match(canonicalType('"two  spaces"'), /two {2}spaces/);
});

test('should preserve overload and duplicate-property order', () => {
	assert.notEqual(
		canonicalType('{ (value: string): 1; (value: number): 2 }'),
		canonicalType('{ (value: number): 2; (value: string): 1 }')
	);
	assert.notEqual(
		canonicalType('{ value: string; value: number }'),
		canonicalType('{ value: number; value: string }')
	);
});

test('should preserve malformed compiler fragments instead of inventing a type', () => {
	assert.equal(canonicalType('Partial<'), 'Partial<');
});

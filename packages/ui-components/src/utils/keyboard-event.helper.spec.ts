import { isImeComposition } from './keyboard-event.helper';

describe('#isImeComposition', () => {
	describe('when a character is being composed', () => {
		it('should return true', () => {
			expect(isImeComposition(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }))).toBe(true);
		});
	});

	describe('when the key was processed by an input method', () => {
		it('should return true', () => {
			expect(isImeComposition(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229 }))).toBe(true);
		});
	});

	describe('when the key is not part of a composition', () => {
		it('should return false', () => {
			expect(isImeComposition(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 }))).toBe(false);
		});
	});
});

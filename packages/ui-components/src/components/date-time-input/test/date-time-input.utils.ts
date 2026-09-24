import { E2EElement, E2EPage } from '@stencil/core/testing';

/** Delay long enough for Inputmask to place the caret after the input is focused */
const INPUT_MASK_CARET_DELAY = 50;

/**
 * Focuses a masked input so it is ready to be typed in. Inputmask places the caret asynchronously on
 * focus, so keystrokes typed right away land out of the mask and are dropped.
 */
export const focusMaskedInput = async (page: E2EPage, input: E2EElement): Promise<void> => {
	await input.focus();
	await new Promise(resolve => setTimeout(resolve, INPUT_MASK_CARET_DELAY));
	await page.waitForChanges();
};

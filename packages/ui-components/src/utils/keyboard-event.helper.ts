// The key code browsers give every key an input method (IME) processes
const IME_PROCESS_KEY_CODE = 229;

/**
 * Whether a key event belongs to an input method composing a character, as when typing Japanese, Chinese or
 * Korean, rather than to the page. Safari dispatches the `keydown` of the Enter that confirms a composition
 * after `compositionend`, so with `isComposing` already `false`: only its key code gives it away. `keyCode`
 * is deprecated for telling keys apart, which `key` does, but this is the use MDN still documents for it.
 */
export const isImeComposition = (event: KeyboardEvent): boolean => event.isComposing || event.keyCode === IME_PROCESS_KEY_CODE;

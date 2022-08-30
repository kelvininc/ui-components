// TODO: Will not be needed in the future (already supported in Chrome, Firefox and Safari, only in Node.js 18)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/supportedValuesOf
export {};

type Key = 'calendar' | 'collation' | 'currency' | 'numberingSystem' | 'timeZone' | 'unit';

declare global {
	interface Window {
		Intl: {
			supportedValuesOf(input: Key): string[];
		};
	}
}

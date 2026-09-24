export const DATE_TIME_INPUTMASK_CONFIG: Inputmask.Options = {
	alias: 'datetime',
	prefillYear: false,
	showMaskOnHover: false,
	clearMaskOnLostFocus: false,
	allowMinus: false
};

// Inputmask >= 5.0.10 follows the unicode.org tokens: `MM` is the month and `mm` the minutes
export const DEFAULT_DATE_FORMAT = 'dd-MM-yyyy HH:mm:ss';
export const DEFAULT_PLACEHOLDER = 'dd-mm-yyyy 00:00:00';

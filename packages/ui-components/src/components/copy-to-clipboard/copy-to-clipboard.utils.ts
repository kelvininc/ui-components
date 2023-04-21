import { ECopyToClipboardState } from './copy-to-clipboard.types';

export const getTooltipText = (state: ECopyToClipboardState, suffix?: string) => {
	if (state === ECopyToClipboardState.Copied) return 'Copied';
	return `Copy ${suffix ? suffix : ''}`.trim();
};

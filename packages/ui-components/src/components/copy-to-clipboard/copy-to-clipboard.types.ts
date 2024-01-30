import { ComputePositionConfig } from '@floating-ui/dom';

export interface ICopyToClipboard {
	/** (required) The text to copy to the clipboard when clicking */
	copiableText: string;
	/** (optional) The suffix to show on the `Copy` tooltip before copying */
	tooltipSuffix?: string;
	/** (optional) Object with tooltip position options */
	tooltipConfig?: Partial<ComputePositionConfig>;
	/** (optional) Delay to show tooltip in milliseconds. */
	tooltipDelay?: number;
}

export enum ECopyToClipboardState {
	ReadyToCopy = 'ready-to-copy',
	Copied = 'copied'
}

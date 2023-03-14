export interface ICopyToClipboard {
	/** (required) The text to copy to the clipboard when clicking */
	copiableText: string;
	/** (optional) The suffix to show on the `Copy` tooltip before copying */
	tooltipSuffix?: string;
}

export enum ECopyToClipboardState {
	ReadyToCopy = 'ready-to-copy',
	Copied = 'copied'
}

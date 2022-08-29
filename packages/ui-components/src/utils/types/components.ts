export enum EAnchorTarget {
	BrowserDefault = '_self',
	NewTab = '_blank',
	Parent = '_parent',
	Top = '_top'
}

export interface IAnchor {
	/** (optional) The anchor's link to open when clicking */
	href?: string;
	/** (optional) The anchor's target */
	target?: EAnchorTarget;
	/** (optional) Specifies that the target will be downloaded when a user clicks on. The value should be the filename */
	download?: string;
}

export interface CssClassMap {
	[className: string]: boolean;
}

export enum EComponentSize {
	Small = 'small',
	Large = 'large'
}

export enum ETooltipPosition {
	Top = 'top',
	TopEnd = 'top-end',
	TopStart = 'top-start',
	Right = 'right',
	RightEnd = 'right-end',
	RightStart = 'right-start',
	Bottom = 'bottom',
	BottomEnd = 'bottom-end',
	BottomStart = 'bottom-start',
	Left = 'left',
	LeftEnd = 'left-end',
	LeftStart = 'left-start'
}

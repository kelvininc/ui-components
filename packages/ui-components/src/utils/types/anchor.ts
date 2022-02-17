export enum EAnchorTarget {
	BrowserDefault = '_self',
	NewTab = '_blank',
	Parent = '_parent',
	Top = '_top'
}

export interface IAnchor {
	href?: string;
	target?: EAnchorTarget;
	rel?: string;
	download?: string;
}

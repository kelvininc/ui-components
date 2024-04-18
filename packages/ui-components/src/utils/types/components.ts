export enum EAnchorTarget {
	BrowserDefault = '_self',
	NewTab = '_blank',
	Parent = '_parent',
	Top = '_top'
}

export type CustomCssClass = string | string[] | CssClassMap;

export interface ICustomCss {
	/**
	 * (optional) Additional classes to apply for custom CSS. If multiple classes are
	 * provided they should be separated by spaces. It is also valid to provide
	 * CssClassMap with boolean logic.
	 */
	customClass?: CustomCssClass;
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

export enum EAlarmSeverity {
	One = '1',
	Two = '2',
	Three = '3',
	Four = '4',
	Five = '5'
}

export interface ITabNavigationItem {
	tabKey: number | string;
	label: string;
	disabled?: boolean;
}

export interface ITabNotification {
	active: boolean;
	color?: string;
}

export interface ITabsNotificationDict {
	[tabKey: string]: ITabNotification;
	[tabKey: number]: ITabNotification;
}

export type ISelectedTabIndicatorConfig = {
	left: string;
	width: string;
};

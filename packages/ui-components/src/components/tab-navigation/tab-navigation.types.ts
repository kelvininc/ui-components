import { EventEmitter } from '@stencil/core';
import { EComponentSize, EIconName, EOtherIconName } from '../../types';

export interface ITabNavigationItem {
	tabKey: number | string;
	label: string;
	icon?: EIconName | EOtherIconName;
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

export interface ITabNavigationConfig {
	/** (required) The tab items to render in this component */
	tabs: ITabNavigationItem[];
	/** (optional) The currently selected tab key */
	selectedTabKey?: number | string;
	/** (optional) To add a notification dot and its respective color to a specific tab */
	notifications?: ITabsNotificationDict;
	/** (optional) Sets the items on this tab nav to use small styling configuration */
	size?: EComponentSize;
}

export interface ITabNavigationEvents {
	/** When the tab selection changes, emit the requested tab's key */
	tabChange: EventEmitter<string>;
}

import { EventEmitter } from '@stencil/core';
import { EBadgeType, EIconName, ETagState } from '../../types';
import { ETabItemType } from '../tab-item/tab-item.types';

export interface ITabNavigationItem {
	tabKey: number | string;
	label: string;
	badge?: string;
	badgeType?: EBadgeType;
	tagIcon?: EIconName;
	tagState?: ETagState;
	disabled?: boolean;
	customAttributes?: Record<string, string>;
}

export interface ITabNotification {
	active: boolean;
	color?: string;
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
	/** (optional) Sets the visual variant of the tab navigation */
	type?: ETabItemType;
}

export interface ITabNavigationEvents {
	/** When the tab selection changes, emit the requested tab's key */
	tabChange: EventEmitter<string>;
}

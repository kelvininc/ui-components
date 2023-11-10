import { EComponentSize } from '../../types';
import { FONT_DESCRIPTOR_SIZE_MAP, TAB_ITEM_NOTIFICATION_DOT_WITH_MARGIN, TAB_ITEM_PADDING_PX, TAB_ITEM_SMALL_ADDED_MARGIN } from './tab-navigation.config';
import { ISelectedTabIndicatorConfig, ITabNavigationItem, ITabsNotificationDict } from './tab-navigation.types';

export const calculateTabWidths = (tabs: ITabNavigationItem[], notifications: ITabsNotificationDict, size: EComponentSize) => {
	const measuringCanvas = document.createElement('canvas');
	const font = FONT_DESCRIPTOR_SIZE_MAP[size];
	const ctx = measuringCanvas.getContext('2d');
	ctx.font = font;

	const values = tabs.reduce<Record<string, ISelectedTabIndicatorConfig>>((acc, { tabKey, label }, idx) => {
		const previousTab = idx > 0 ? tabs[idx - 1] : undefined;
		const leftOffset = previousTab ? +acc[previousTab.tabKey].width + +acc[previousTab.tabKey].left : 0;
		const notificationDotWidth = notifications[tabKey]?.active ? TAB_ITEM_NOTIFICATION_DOT_WITH_MARGIN : 0;
		const small = size === EComponentSize.Small ? TAB_ITEM_SMALL_ADDED_MARGIN : 0;
		const textWidth = Math.ceil(ctx.measureText(label).width);

		acc[tabKey] = {
			left: `${leftOffset}`,
			width: `${textWidth + TAB_ITEM_PADDING_PX + notificationDotWidth + small}`
		};

		return acc;
	}, {});

	return values;
};

import { BADGE_FONT_DESCRIPTION, BADGE_PADDING_PX, TAB_ITEM_GAP_PX, TAB_ITEM_ICON_WIDTH_PX, TAB_ITEM_PADDING_PX, TEXT_FONT_DESCRIPTION } from './tab-navigation.config';
import { ISelectedTabIndicatorConfig, ITabNavigationItem } from './tab-navigation.types';

export const calculatePrimaryTabWidths = async (tabs: ITabNavigationItem[]) => {
	await document.fonts.load(TEXT_FONT_DESCRIPTION);
	await document.fonts.load(BADGE_FONT_DESCRIPTION);

	const textMeasuringCanvas = document.createElement('canvas');
	const textCtx = textMeasuringCanvas.getContext('2d');
	textCtx.font = TEXT_FONT_DESCRIPTION;

	const badgeMeasuringCanvas = document.createElement('canvas');
	const badgeCtx = badgeMeasuringCanvas.getContext('2d');
	badgeCtx.font = BADGE_FONT_DESCRIPTION;

	const values = tabs.reduce<Record<string, ISelectedTabIndicatorConfig>>((acc, { tabKey, label, tagIcon, badge }, idx) => {
		const previousTab = idx > 0 ? tabs[idx - 1] : undefined;
		const leftOffset = previousTab ? +acc[previousTab.tabKey].width + +acc[previousTab.tabKey].left : 0;
		const tagIconWidth = tagIcon ? TAB_ITEM_ICON_WIDTH_PX + TAB_ITEM_GAP_PX : 0;
		const textWidth = Math.round(textCtx.measureText(label).width);
		const badgeWidth = badge ? Math.round(badgeCtx.measureText(badge).width) + BADGE_PADDING_PX + TAB_ITEM_GAP_PX : 0;

		acc[tabKey] = {
			left: `${leftOffset}`,
			width: `${textWidth + TAB_ITEM_PADDING_PX + tagIconWidth + badgeWidth}`
		};

		return acc;
	}, {});

	return values;
};

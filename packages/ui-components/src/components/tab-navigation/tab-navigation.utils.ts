import { HTMLStencilElement } from '@stencil/core/internal';
import { ITabNavigationItem } from './tab-navigation.types';
import { gte, isEmpty } from 'lodash';

export const findTabElement = (tabNavEl: HTMLKvTabNavigationElement, tabs: ITabNavigationItem[], selectedTabKey: string | number): HTMLKvTabItemElement => {
	const tabIndex = tabs?.findIndex(tab => tab.tabKey === selectedTabKey);

	if (gte(tabIndex, 0) && !isEmpty(tabs) && !isEmpty(selectedTabKey)) {
		return tabNavEl.shadowRoot.children[tabIndex] as HTMLKvTabItemElement;
	}

	return;
};

export const getRelativeClientRect = (el: HTMLStencilElement): DOMRect => {
	const rect = el.getBoundingClientRect();
	const parentRect = el.offsetParent?.getBoundingClientRect();

	if (!parentRect) return;

	return {
		x: rect.x,
		y: rect.y,
		bottom: parentRect.bottom - rect.bottom,
		height: rect.height,
		left: rect.left - parentRect.left,
		right: parentRect.right - rect.right,
		top: rect.top - parentRect.top,
		width: rect.width
	} as DOMRect;
};

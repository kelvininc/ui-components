import { Component, Host, h, State, Prop, Element, Watch } from '@stencil/core';
import { gte, isEmpty } from 'lodash-es';
import { EComponentSize } from '../../utils/types';
import { ITabNavigationItem } from '../tab-navigation/tab-navigation.types';

@Component({
	tag: 'kv-tab-list',
	styleUrl: 'tab-list.scss',
	shadow: true
})
export class KvTabList {
	/** (required) The tab items to render in this component to force re-renders when the tabs change*/
	@Prop() tabs!: ITabNavigationItem[];
	/** (required) The currently selected tab's key (unique identifier) */
	@Prop() selectedTabKey!: number | string;
	/** (optional) Sets the items on this tab list to use a different styling configuration */
	@Prop() size?: EComponentSize = EComponentSize.Large;
	/** Watch for changes on  */
	@Watch('size')
	sizeChangeHandler() {
		this.changeTabsSize();
		this.calculateSelectionAnimationProperties();
	}
	/** Watch for tab selection change and react accordingly by updating the internal states */
	@Watch('selectedTabKey')
	tabSelectionChangeHandler() {
		this.calculateSelectionAnimationProperties();
	}
	/** Watch for tab selection change and react accordingly by updating the internal states */
	@Watch('tabs')
	tabsUpdateChangeHandler() {
		this.tabItems = Array.from(this.el.querySelectorAll('kv-tab-item'));
		this.calculateSelectionAnimationProperties();
	}

	/** The left offset of the tab indicator (in px), updated when the selected tab changes, starts at 24 due to kv-tab-item's margin */
	@State() selectedTabIndicatorOffset: number = 0;
	/** The width of the tab indicator, updated when the selected tab changes */
	@State() selectedTabIndicatorWidth: number = 0;

	// Reference to self
	@Element() el: HTMLKvTabListElement;

	// All the kv-tab-item elements
	private tabItems: HTMLKvTabItemElement[];

	componentDidRender() {
		this.tabItems = Array.from(this.el.querySelectorAll('kv-tab-item'));
		this.changeTabsSize();
		this.calculateSelectionAnimationProperties();
	}

	private changeTabsSize() {
		this.tabItems.forEach(tabItem => (tabItem.size = this.size));
	}

	private calculateSelectionAnimationProperties() {
		const tabIndex = this.tabItems?.findIndex(tab => tab.tabKey === this.selectedTabKey);

		if (gte(tabIndex, 0) && !isEmpty(this.tabItems)) {
			const selectedTabEl = this.tabItems.find((_tabRef, index) => tabIndex === index);
			const labelEl: HTMLElement = selectedTabEl.shadowRoot.querySelector('.label');
			this.selectedTabIndicatorOffset = labelEl.offsetLeft;
			this.selectedTabIndicatorWidth = labelEl.clientWidth / 2;
		}
	}

	render() {
		const tabIndicatorStyle = {
			left: this.selectedTabIndicatorOffset + 'px',
			width: this.selectedTabIndicatorWidth + 'px'
		};

		return (
			<Host>
				<slot></slot>
				<div class="selected-tab-indicator" style={tabIndicatorStyle}></div>
			</Host>
		);
	}
}

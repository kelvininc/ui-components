import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { ITabNavigationItem, ITabsNotificationDict } from './tab-navigation.types';
import { gte, isEmpty } from 'lodash-es';

import { EComponentSize } from '../../utils/types';

@Component({
	tag: 'kv-tab-navigation',
	styleUrl: 'tab-navigation.scss',
	shadow: true
})
export class KvTabNavigation {
	/** (required) The tab items to render in this component */
	@Prop({ reflect: true }) tabs!: ITabNavigationItem[];
	/** (optional) The currently selected tab key */
	@Prop() selectedTabKey?: number | string;
	/** (optional) To add a notification dot and its respective color to a specific tab */
	@Prop() notifications?: ITabsNotificationDict = {};
	/** (optional) Sets the items on this tab nav to use small styling configuration */
	@Prop() size?: EComponentSize = EComponentSize.Large;

	/** When the tab selection changes, emit the requested tab's key */
	@Event() tabChange: EventEmitter<string>;

	/** Listen to custom DOM event of tab selection */
	@Listen('tabSelected')
	tabSelectionHandler(event: CustomEvent<string>) {
		this.tabChange.emit(event.detail);
	}

	/** Watch for tab selection change and react accordingly by updating the internal states */
	@Watch('selectedTabKey')
	tabSelectionChangeHandler() {
		this.calculateSelectionAnimationProperties();
	}

	/** The left offset of the tab indicator (in px), updated when the selected tab changes, starts at 24 due to kv-tab-item's margin */
	@State() selectedTabIndicatorOffset: number = 0;
	/** The width of the tab indicator, updated when the selected tab changes */
	@State() selectedTabIndicatorWidth: number = 0;

	@Element() el: HTMLKvTabNavigationElement;

	componentDidRender() {
		this.calculateSelectionAnimationProperties();
	}

	private calculateSelectionAnimationProperties() {
		const tabIndex = this.tabs?.findIndex(tab => tab.tabKey === this.selectedTabKey);

		if (gte(tabIndex, 0) && !isEmpty(this.tabs) && !isEmpty(this.selectedTabKey)) {
			const selectedTabEl = this.el.shadowRoot.children[tabIndex] as HTMLKvTabItemElement;
			this.selectedTabIndicatorOffset = selectedTabEl.offsetLeft;
			this.selectedTabIndicatorWidth = selectedTabEl.clientWidth;
		}
	}

	render() {
		const tabIndicatorStyle = {
			left: this.selectedTabIndicatorOffset + 'px',
			width: this.selectedTabIndicatorWidth + 'px'
		};

		return (
			<Host>
				{this.tabs.map(item => (
					<kv-tab-item
						tabKey={item.tabKey}
						label={item.label}
						disabled={item.disabled}
						selected={item.tabKey === this.selectedTabKey}
						size={this.size}
						hasNotification={this.notifications[item.tabKey]?.active}
						notificationColor={this.notifications[item.tabKey]?.color}
					></kv-tab-item>
				))}
				<div class="selected-tab-indicator" style={tabIndicatorStyle}></div>
			</Host>
		);
	}
}

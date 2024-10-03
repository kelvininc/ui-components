import { Component, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { ISelectedTabIndicatorConfig, ITabNavigationConfig, ITabNavigationEvents, ITabNavigationItem, ITabsNotificationDict } from './tab-navigation.types';

import { EComponentSize } from '../../utils/types';
import { isEmpty } from 'lodash-es';
import { calculateTabWidths } from './tab-navigation.utils';

@Component({
	tag: 'kv-tab-navigation',
	styleUrl: 'tab-navigation.scss',
	shadow: true
})
export class KvTabNavigation implements ITabNavigationConfig, ITabNavigationEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) tabs: ITabNavigationItem[] = [];
	/** @inheritdoc */
	@Prop() selectedTabKey?: number | string;
	/** @inheritdoc */
	@Prop() notifications?: ITabsNotificationDict = {};
	/** @inheritdoc */
	@Prop() size?: EComponentSize = EComponentSize.Large;

	/** @inheritdoc */
	@Event() tabChange: EventEmitter<string>;

	private tabsIndicatorConfig: Record<string, ISelectedTabIndicatorConfig> = {};

	/** Listen to custom DOM event of tab selection */
	@Listen('tabSelected')
	tabSelectionHandler(event: CustomEvent<string>) {
		this.tabChange.emit(event.detail);
	}

	/** Watch for tabs change to calculate elements width */
	@Watch('tabs')
	@Watch('size')
	@Watch('notifications')
	tabsChangeHandler() {
		this.tabsIndicatorConfig = calculateTabWidths(this.tabs, this.notifications, this.size);
		this.applySelectedTabStyling();
	}

	/** Watch for tab selection change and react accordingly by updating the internal states */
	@Watch('selectedTabKey')
	tabSelectionChangeHandler() {
		if (isEmpty(this.tabsIndicatorConfig)) {
			this.tabsIndicatorConfig = calculateTabWidths(this.tabs, this.notifications, this.size);
		}

		this.applySelectedTabStyling();
	}

	/** The left offset and width of the tab indicator, recalculated when the selected tab changes */
	@State() selectedTabIndicatorConfig: ISelectedTabIndicatorConfig = {
		left: '0px',
		width: '0px'
	};

	componentDidLoad() {
		this.tabsIndicatorConfig = calculateTabWidths(this.tabs, this.notifications, this.size);
		this.applySelectedTabStyling();
	}

	private applySelectedTabStyling() {
		if (isEmpty(this.selectedTabKey) || isEmpty(this.tabsIndicatorConfig[this.selectedTabKey])) return;

		const { left, width } = this.tabsIndicatorConfig[this.selectedTabKey];

		this.selectedTabIndicatorConfig = {
			left: `${left}px`,
			width: `${width}px`
		};
	}

	render() {
		return (
			<Host>
				{this.tabs.map(item => (
					<kv-tab-item
						key={item.tabKey}
						tabKey={item.tabKey}
						label={item.label}
						disabled={item.disabled}
						selected={item.tabKey === this.selectedTabKey}
						size={this.size}
						hasNotification={this.notifications[item.tabKey]?.active}
						notificationColor={this.notifications[item.tabKey]?.color}
					/>
				))}
				<div class="selected-tab-indicator" style={this.selectedTabIndicatorConfig} />
			</Host>
		);
	}
}

import { Component, Host, h, Prop, Listen, Event, EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../utils/types';
import { ITabNavigationItem, ITabsNotificationDict } from './tab-navigation.types';

@Component({
	tag: 'kv-tab-navigation',
	shadow: true
})
export class KvTabNavigation {
	/** (required) The tab items to render in this component */
	@Prop({ reflect: true }) tabs!: ITabNavigationItem[];
	/** (required) The currently selected tab key */
	@Prop() selectedTabKey!: number | string;
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

	render() {
		return (
			<Host>
				<kv-tab-list tabs={this.tabs} selectedTabKey={this.selectedTabKey} size={this.size}>
					{this.tabs.map(item => (
						<kv-tab-item
							tabKey={item.tabKey}
							label={item.label}
							disabled={item.disabled}
							selected={item.tabKey === this.selectedTabKey}
							hasNotification={this.notifications[item.tabKey]?.active}
							notificationColor={this.notifications[item.tabKey]?.color}
						></kv-tab-item>
					))}
				</kv-tab-list>
			</Host>
		);
	}
}

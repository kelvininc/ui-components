import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { ISelectedTabIndicatorConfig, ITabNavigationItem, ITabsNotificationDict } from './tab-navigation.types';

import { EComponentSize } from '../../utils/types';
import { findTabElement, getRelativeClientRect } from './tab-navigation.utils';
import { HTMLStencilElement } from '@stencil/core/internal';

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
		this.calculateTabIndicatorPosition();
	}

	/** The left offset and width of the tab indicator, recalculated when the selected tab changes */
	@State() selectedTabIndicatorConfig: ISelectedTabIndicatorConfig = {
		left: '0px',
		width: '0px'
	};

	@Element() el: HTMLKvTabNavigationElement;

	initialRenderIntervalId: number;

	componentDidLoad() {
		const selectedTabEl = findTabElement(this.el, this.tabs, this.selectedTabKey);
		this.setIntervalUntilElementIsVisible(selectedTabEl);
	}

	disconnectedCallback() {
		window.clearInterval(this.initialRenderIntervalId);
	}

	private setIntervalUntilElementIsVisible = (element: HTMLStencilElement, intervalMs: number = 100): void => {
		this.initialRenderIntervalId = window.setInterval(() => {
			const rect = getRelativeClientRect(element);

			if (rect && rect.width > 0) {
				window.clearInterval(this.initialRenderIntervalId);
				this.updateTabIndicatorConfig(rect);
				return;
			}
		}, intervalMs);
	};

	private updateTabIndicatorConfig = (rect: DOMRect) => {
		this.selectedTabIndicatorConfig = {
			left: `${rect.left}px`,
			width: `${rect.width}px`
		};
	};

	private calculateTabIndicatorPosition() {
		const selectedTabEl = findTabElement(this.el, this.tabs, this.selectedTabKey);

		if (selectedTabEl) {
			this.updateTabIndicatorConfig(getRelativeClientRect(selectedTabEl));
		}
	}

	render() {
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
				<div class="selected-tab-indicator" style={this.selectedTabIndicatorConfig}></div>
			</Host>
		);
	}
}

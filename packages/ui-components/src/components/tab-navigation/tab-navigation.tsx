import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { ISelectedTabIndicatorConfig, ITabNavigationItem, ITabsNotificationDict } from './tab-navigation.types';

import { EComponentSize } from '../../utils/types';
import { getIntersectionRelativeClientRect } from './tab-navigation.utils';
import { INTERSECTION_OBSERVER_CONFIG } from './tab-navigation.config';

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

	tabEls: Record<number | string, HTMLKvTabItemElement> = {};

	/** Listen to custom DOM event of tab selection */
	@Listen('tabSelected')
	tabSelectionHandler(event: CustomEvent<string>) {
		this.tabChange.emit(event.detail);
	}

	/** Watch for tab selection change and react accordingly by updating the internal states */
	@Watch('selectedTabKey')
	tabSelectionChangeHandler() {
		this.observeTabItemVisibility(this.tabEls[this.selectedTabKey]);
	}

	/** The left offset and width of the tab indicator, recalculated when the selected tab changes */
	@State() selectedTabIndicatorConfig: ISelectedTabIndicatorConfig = {
		left: '0px',
		width: '0px'
	};

	@Element() el: HTMLKvTabNavigationElement;

	observer: IntersectionObserver;

	constructor() {
		this.observer = new IntersectionObserver(this.intersectionHandler, INTERSECTION_OBSERVER_CONFIG);
	}

	componentDidLoad() {
		this.observeTabItemVisibility(this.tabEls[this.selectedTabKey]);
	}

	disconnectedCallback() {
		this.observer.disconnect();
	}

	private registerTabElement = (tabKey: number | string, el: HTMLKvTabItemElement) => {
		if (this.tabEls[tabKey]) return;
		this.tabEls[tabKey] = el;
	};

	private observeTabItemVisibility = (element: HTMLKvTabItemElement) => {
		this.observer.disconnect();
		this.observer.observe(element);
	};

	private intersectionHandler = (entries: IntersectionObserverEntry[]) => {
		entries.forEach(intersection => {
			const rect = getIntersectionRelativeClientRect(intersection);

			this.selectedTabIndicatorConfig = {
				left: `${rect.left}px`,
				width: `${rect.width}px`
			};
		});

		this.observer.disconnect();
	};

	render() {
		return (
			<Host>
				{this.tabs.map(item => (
					<kv-tab-item
						ref={el => this.registerTabElement(item.tabKey, el)}
						tabKey={item.tabKey}
						label={item.label}
						disabled={item.disabled}
						selected={item.tabKey === this.selectedTabKey}
						size={this.size}
						hasNotification={this.notifications[item.tabKey]?.active}
						notificationColor={this.notifications[item.tabKey]?.color}
					/>
				))}
				<div class="selected-tab-indicator" style={this.selectedTabIndicatorConfig}></div>
			</Host>
		);
	}
}

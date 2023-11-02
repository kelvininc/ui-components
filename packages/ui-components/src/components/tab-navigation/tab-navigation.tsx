import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { ISelectedTabIndicatorConfig, ITabNavigationConfig, ITabNavigationEvents, ITabNavigationItem, ITabsNotificationDict } from './tab-navigation.types';

import { EComponentSize } from '../../utils/types';
import { getIntersectionRelativeClientRect } from './tab-navigation.utils';
import { DEFAULT_INDICATOR_TIMEOUT_WAIT, INTERSECTION_OBSERVER_CONFIG } from './tab-navigation.config';

@Component({
	tag: 'kv-tab-navigation',
	styleUrl: 'tab-navigation.scss',
	shadow: true
})
export class KvTabNavigation implements ITabNavigationConfig, ITabNavigationEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) tabs!: ITabNavigationItem[];
	/** @inheritdoc */
	@Prop() selectedTabKey?: number | string;
	/** @inheritdoc */
	@Prop() notifications?: ITabsNotificationDict = {};
	/** @inheritdoc */
	@Prop() size?: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop() indicatorCalculationTimeoutMs?: number = DEFAULT_INDICATOR_TIMEOUT_WAIT;

	/** @inheritdoc */
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
		setTimeout(() => this.observeTabItemVisibility(this.tabEls[this.selectedTabKey]), this.indicatorCalculationTimeoutMs);
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
		setTimeout(() => this.observeTabItemVisibility(this.tabEls[this.selectedTabKey]), this.indicatorCalculationTimeoutMs);
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
			const rect = getIntersectionRelativeClientRect(intersection, this.el);

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

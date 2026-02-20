import { Component, Event, EventEmitter, Listen, Prop, State, Watch, h } from '@stencil/core';
import { ISelectedTabIndicatorConfig, ITabNavigationConfig, ITabNavigationEvents, ITabNavigationItem } from './tab-navigation.types';

import { isEmpty } from 'lodash-es';
import { ETabItemType } from '../tab-item/tab-item.types';
import { calculatePrimaryTabWidths } from './tab-navigation.utils';
import { ETagState } from '../tag-status/tag-status.types';
import { EBadgeType } from '../badge/badge.types';

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
	@Prop() type?: ETabItemType = ETabItemType.Primary;

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
	@Watch('type')
	async tabsChangeHandler() {
		if (this.type === ETabItemType.Primary) {
			this.tabsIndicatorConfig = await calculatePrimaryTabWidths(this.tabs);
			this.applySelectedTabStyling();
		}
	}

	/** Watch for tab selection change and react accordingly by updating the internal states */
	@Watch('selectedTabKey')
	async tabSelectionChangeHandler() {
		if (this.type === ETabItemType.Secondary) return;

		if (isEmpty(this.tabsIndicatorConfig)) {
			this.tabsIndicatorConfig = await calculatePrimaryTabWidths(this.tabs);
		}

		this.applySelectedTabStyling();
	}

	/** The left offset and width of the tab indicator, recalculated when the selected tab changes */
	@State() selectedTabIndicatorConfig: ISelectedTabIndicatorConfig = {
		left: '0px',
		width: '0px'
	};

	async componentDidLoad() {
		if (this.type === ETabItemType.Primary) {
			this.tabsIndicatorConfig = await calculatePrimaryTabWidths(this.tabs);
			this.applySelectedTabStyling();
		}
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
			<div class={{ [this.type]: true }}>
				{this.tabs.map(item => (
					<kv-tab-item
						key={item.tabKey}
						tabKey={item.tabKey}
						label={item.label}
						disabled={item.disabled}
						selected={item.tabKey === this.selectedTabKey}
						type={this.type}
						customAttributes={item.customAttributes}
					>
						{(!isEmpty(item.badge) || !isEmpty(item.tagIcon)) && (
							<div slot="right-slot">
								{!isEmpty(item.badge) && <kv-badge type={item.badgeType ?? EBadgeType.Secondary}>{item.badge}</kv-badge>}
								{!isEmpty(item.tagIcon) && <kv-tag-status icon={item.tagIcon} state={item.tagState ?? ETagState.Unknown} />}
							</div>
						)}
					</kv-tab-item>
				))}
				{this.type === ETabItemType.Primary && <div class="selected-tab-indicator" style={this.selectedTabIndicatorConfig} />}
			</div>
		);
	}
}

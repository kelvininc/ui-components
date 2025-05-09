import { Component, Element, Event, EventEmitter, Fragment, Host, Listen, Prop, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { ETreeItemLabelSize, ETreeItemState } from './tree-item.types';
import { isEmpty, isNumber, throttle } from 'lodash-es';

import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { EBadgeState } from '../badge/badge.types';
import { STATE_ICONS } from './tree-item.config';

/**
 * @slot child-slot - Content is placed in the child subgroup and can be expanded and collapsed.
 * @part children - The children container.
 */
@Component({
	tag: 'kv-tree-item',
	styleUrl: 'tree-item.scss',
	shadow: true
})
export class KvTreeItem {
	/** (optional) Defines the title of the tree item.*/
	@Prop({ reflect: true }) label?: string;
	/** (optional) Defines the sub-title of the tree item, displayed under the title.*/
	@Prop({ reflect: true }) additionalLabel?: string;
	/** (optional) Defines the placeholder of the tree item, displayed when title is not filled.*/
	@Prop({ reflect: true }) placeholder?: string;
	/** (optional) Defines the font size of title and subtitle labels.*/
	@Prop({ reflect: true }) labelsSize?: ETreeItemLabelSize = ETreeItemLabelSize.Small;
	/** (optional) Defines the icon of the tree item. If set, an icon will be displayed before the label.*/
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** (optional) Defines the state of the icon.*/
	@Prop({ reflect: true }) iconState?: ETreeItemState;
	/** (optional) Defines the counter info of the tree item. If set, an badge will be displayed in the end of tree item.*/
	@Prop({ reflect: true }) counter?: number;
	/** (optional) Defines the state of the counter.*/
	@Prop({ reflect: true }) counterState?: EBadgeState;
	/** (optional) Defines whether the tree node has children, even if currently no other tree nodes are slotted inside.
	 * This property is useful for showing big tree structures where not all nodes are initially loaded due to performance reasons.
	 * Set this to <code>true</code> for nodes you intend to load lazily, when the user clicks the expand button.
	 * It is not necessary to set this property otherwise. If a tree item has children, the expand button will be displayed anyway.
	 */
	@Prop({ reflect: true }) hasChildren? = false;
	/** (optional) Defines whether the tree node is expanded or collapsed. Only has visual effect for tree nodes with children.*/
	@Prop({ reflect: true }) expanded? = false;
	/** (optional) Defines whether the tree node is disabled.*/
	@Prop({ reflect: true }) disabled? = false;
	/** (optional) Defines whether the tree node is selected by the user.*/
	@Prop({ reflect: true }) selected? = false;
	/** (optional) Defines whether the tree node is highlighted.*/
	@Prop({ reflect: true }) highlighted? = false;
	/** (optional) Defines whether the tree node is spotlight.*/
	@Prop({ reflect: true }) spotlighted? = false;
	/** (optional) Defines whether the label should be displayed as tooltip.*/
	@Prop({ reflect: true }) showTooltip? = false;
	/** (optional) Delay to show tooltip in milliseconds. */
	@Prop({ reflect: true }) tooltipDelay?: number;
	/** (optional) Defines whether the tree node is loading. */
	@Prop({ reflect: true }) loading? = false;
	/** (optional) Defines if the item click event should prevent default behaviour. */
	@Prop({ reflect: true }) preventDefault? = false;
	/** (optional) Defines if icon to use for expanding, should be and arrow like icon pointing up. */
	@Prop({ reflect: true }) expandIcon? = EIconName.ArrowDropUp;

	/** Emitted when the expand toggle is clicked */
	@Event() toggleExpand: EventEmitter<MouseEvent>;
	/** Emitted when the tree item is clicked */
	@Event() itemClick: EventEmitter<MouseEvent>;

	/** Don't propagate the children click event */
	@Listen('itemClick')
	itemClickHandler(event: MouseEvent) {
		event.stopPropagation();
	}

	/** Don't propagate the children toggle event */
	@Listen('toggleExpand')
	toggleExpandHandler(event: MouseEvent) {
		event.stopPropagation();
	}

	// Reference to self
	@Element() el: HTMLKvTreeItemElement;

	private toggleClickThrottler: (e: MouseEvent) => void;
	private itemClickThrottler: (e: MouseEvent) => void;

	private get hasChildrenSlot() {
		return !isEmpty(this.el.querySelector('[slot="child-slot"]'));
	}

	get requiresToggleButton() {
		return this.hasChildren || this.hasChildrenSlot;
	}

	connectedCallback() {
		this.toggleClickThrottler = throttle((event: MouseEvent) => this.toggleExpand.emit(event), DEFAULT_THROTTLE_WAIT);
		this.itemClickThrottler = throttle((event: MouseEvent) => this.itemClick.emit(event), DEFAULT_THROTTLE_WAIT);
	}

	private onItemClick(event: MouseEvent) {
		if (this.preventDefault) {
			event.preventDefault();
		}

		this.itemClickThrottler(event);
	}

	render() {
		return (
			<Host>
				<div class="node-container">
					<div
						class={{
							'node-wrapper': true,
							'disabled': this.disabled,
							'selected': this.selected,
							'highlighted': this.highlighted,
							'spotlight': this.spotlighted,
							'loading': this.loading
						}}
					>
						{!this.loading && (
							<Fragment>
								{this.requiresToggleButton && (
									<div class="expander-arrow" onClick={this.toggleClickThrottler}>
										<kv-icon
											name={this.expandIcon}
											customClass={{
												'pk-grey3': true,
												'rotate-180': this.expanded,
												'rotate-90': !this.expanded
											}}
										/>
									</div>
								)}

								<div
									class={{
										'node-content-wrapper': true,
										'disabled': this.disabled,
										'selected': this.selected,
										'no-filled': isEmpty(this.label) && !isEmpty(this.placeholder)
									}}
									onClick={!this.disabled && this.onItemClick.bind(this)}
								>
									{this.icon && (
										<div class="node-icon">
											<kv-icon name={this.icon} class="main-icon" exportparts="icon"></kv-icon>
											{this.iconState && (
												<kv-icon name={STATE_ICONS[this.iconState]} customClass="icon-12" class={{ 'state-icon': true, [this.iconState]: true }} />
											)}
										</div>
									)}

									{(this.label || this.placeholder) && (
										<div class={`labels labels-${this.labelsSize}`}>
											<kv-tooltip delay={this.tooltipDelay} disabled={!this.showTooltip} text={this.label || this.placeholder} truncate>
												<div class={{ title: true, [`title-${this.labelsSize}`]: true }}>{this.label || this.placeholder}</div>
											</kv-tooltip>
											{this.additionalLabel && <div class="sub-title">{this.additionalLabel}</div>}
										</div>
									)}

									<div class="right-indicators">
										{isNumber(this.counter) && this.counter >= 0 && (
											<div class="alarm-bubble">
												<kv-badge state={this.counterState}>{this.counter > 100 ? '+99' : this.counter}</kv-badge>
											</div>
										)}
									</div>
								</div>
							</Fragment>
						)}
						{this.loading && <div class="node-loading"></div>}
					</div>
					<div part="children" class="children" style={{ display: this.expanded ? 'block' : 'none' }}>
						<slot name="child-slot"></slot>
					</div>
				</div>
			</Host>
		);
	}
}

import { Component, Element, Event, EventEmitter, Fragment, h, Host, Listen, Prop, State } from '@stencil/core';
import { throttle, isNumber, isEmpty, debounce } from 'lodash-es';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { STATE_ICONS } from './tree-item.config';
import { calcDargPos } from './tree-item.helper';
import { EDropType, ETreeItemState } from './tree-item.types';

/**
 * @slot child-slot - Content is placed in the child subgroup and can be expanded and collapsed.
 */
@Component({
	tag: 'kv-tree-item',
	styleUrls: {
		night: 'tree-item.night.scss',
		light: 'tree-item.light.scss'
	},
	shadow: true
})
export class KvTreeItem {
	/** (optional) Defines the title of the tree item.*/
	@Prop({ reflect: true }) label?: string;
	/** (optional) Defines the sub-title of the tree item, displayed under the title.*/
	@Prop({ reflect: true }) additionalLabel?: string;
	/** (optional) Defines the placeholder of the tree item, displayed when title is not filled.*/
	@Prop({ reflect: true }) placeholder?: string;
	/** (optional) Defines the icon of the tree item. If set, an icon will be displayed before the label.*/
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** (optional) Defines the state of the icon.*/
	@Prop({ reflect: true }) iconState?: ETreeItemState;
	/** (optional) Defines the counter info of the tree item. If set, an badge will be displayed in the end of tree item.*/
	@Prop({ reflect: true }) counter?: number;
	/** (optional) Defines the state of the counter.*/
	@Prop({ reflect: true }) counterState?: ETreeItemState;
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
	/** (optional) Defines whether the tree node is loading. */
	@Prop({ reflect: true }) loading? = false;

	/** Specify if dragging the tree item is allowed. This could be a boolean */
	@Prop() allowDrag? = false;

	/** Specify if drop the tree item is allowed. This could be a boolean */
	@Prop() allowDrop? = false;

	/** Emitted when the expand toggle is clicked */
	@Event() toggleExpand: EventEmitter<MouseEvent>;
	/** Emitted when the tree item is clicked */
	@Event() itemClick: EventEmitter<MouseEvent>;
	/** Emitted when drag over the tree item */
	@Event() dragOverItem: EventEmitter<EDropType>;

	/** Emitted when the tree item drag start */
	@Event() dragStartItem: EventEmitter<MouseEvent>;
	/** Emitted when the tree item drag end */
	@Event() dragEndItem: EventEmitter<MouseEvent>;

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

	/** Don't propagate the children dragOverItem event */
	@Listen('dragOverItem')
	dragOverItemHandler(event: MouseEvent) {
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
		this.toggleClickThrottler = throttle((event: MouseEvent) => this.toggleExpand.emit(event), 300);
		this.itemClickThrottler = throttle((event: MouseEvent) => this.itemClick.emit(event), 300);
	}

	/** Internal on drag state */
	@State() onDrag = false;

	/** Internal on drag state */
	@State() onDropType: EDropType = EDropType.None;

	@State() lastOverY: number;

	private onDragOver = (event: DragEvent) => {
		if (this.onDrag) {
			return;
		}

		if (this.allowDrop) {
			event.preventDefault();
		}

		// Ignore if the Y position not change
		if (this.lastOverY === event.pageY) {
			return;
		}
		this.lastOverY = event.pageY;

		console.log('TREE ITEM ALLOW DROP:', this.label, this.allowDrop);
		console.log('### TREE ITEM onDragOver:', event);
		const nodeContainerElem = this.el.shadowRoot.getElementById('content');
		const containerHeightPart = nodeContainerElem.clientHeight / 3;
		const dragPos = calcDargPos(event, nodeContainerElem);

		const m_posY = dragPos.y;

		if (m_posY <= containerHeightPart) {
			// Drop up
			this.setDropType(EDropType.Up);
		} else if (m_posY <= containerHeightPart * 2) {
			// Drop inside
			this.setDropType(EDropType.Inside);
		} else if (m_posY <= containerHeightPart * 3) {
			if (this.hasChildrenSlot && this.expanded) {
				// Drop inside
				this.setDropType(EDropType.Inside);
			} else {
				// Drop down
				this.setDropType(EDropType.Down);
			}
		}
	};

	// to have a better behavior
	private setDropType = debounce((type: EDropType) => {
		this.onDropType = type;
		this.dragOverItem.emit(type);
	}, 50);

	private onDragLeave = (event: DragEvent) => {
		event.preventDefault();
		if (!this.onDrag) {
			console.log('onDragLeave', this.label, event);
			this.setDropType(EDropType.None);
		}
	};

	private dragStart = event => {
		event.stopPropagation();
		this.onDrag = true;
		this.dragStartItem.emit(event);
	};

	private dragEnd = event => {
		event.stopPropagation();
		this.onDrag = false;
		this.dragEndItem.emit(event);
	};

	private onDrop(event: DragEvent) {
		if (!this.allowDrop) {
			return;
		}
		event.preventDefault();
		console.log('onDrop', this.onDropType);
		this.setDropType(EDropType.None);
	}

	render() {
		return (
			<Host>
				<div draggable={this.allowDrag} onDragStart={this.dragStart} onDragEnd={this.dragEnd} class="node-container">
					<div id="content" onDragOver={event => this.onDragOver(event)} onDragLeave={event => this.onDragLeave(event)} onDrop={event => this.onDrop(event)}>
						{this.onDropType === EDropType.Up && (
							<div class={{ 'drag-slot': true, 'allowed': this.allowDrop }}>
								<div class="badge">
									<kv-icon name={this.allowDrop ? EIconName.Add : EIconName.Close}></kv-icon>
								</div>
								<div class="line"></div>
							</div>
						)}
						<div
							class={{
								'node-wrapper': true,
								'disabled': this.disabled,
								'selected': this.selected,
								'highlighted': this.highlighted,
								'loading': this.loading,
								'no-node-gap': this.onDropType === EDropType.Up,
								'drag-over--allowed': this.onDropType === EDropType.Inside && this.allowDrop,
								'drag-over--not-allowed': this.onDropType === EDropType.Inside && !this.allowDrop
							}}
						>
							{!this.loading && (
								<Fragment>
									{this.requiresToggleButton && (
										<div class="expander-arrow" onClick={this.toggleClickThrottler}>
											<kv-icon name={this.expanded ? EIconName.ArrowDropDown : EIconName.ArrowRight} />
										</div>
									)}

									<div
										class={{
											'node-content-wrapper': true,
											'disabled': this.disabled,
											'selected': this.selected,
											'no-filled': isEmpty(this.label) && !isEmpty(this.placeholder)
										}}
										onClick={!this.disabled && this.itemClickThrottler}
									>
										{this.icon && (
											<div class="node-icon">
												<kv-icon name={this.icon} customClass="icon-24" class="main-icon"></kv-icon>
												{this.iconState && (
													<kv-icon
														name={STATE_ICONS[this.iconState]}
														customClass="icon-12"
														class={{ 'state-icon': true, [this.iconState]: true }}
													></kv-icon>
												)}
											</div>
										)}

										{(this.label || this.placeholder) && (
											<div class="labels">
												<div class="title">{this.label || this.placeholder}</div>
												{this.additionalLabel && <div class="sub-title">{this.additionalLabel}</div>}
											</div>
										)}

										<div class="right-indicators">
											{isNumber(this.counter) && this.counter >= 0 && (
												<div class={{ 'alarm-bubble': true, [this.counterState]: true }}>
													<span>{this.counter > 100 ? '+99' : this.counter}</span>
												</div>
											)}
										</div>
									</div>
								</Fragment>
							)}
							{this.loading && <div class="node-loading"></div>}
						</div>
						{this.onDropType === EDropType.Down && (
							<div class={{ 'drag-slot': true, 'allowed': this.allowDrop }}>
								<div class="badge">
									<kv-icon name={this.allowDrop ? EIconName.Add : EIconName.Close}></kv-icon>
								</div>
								<div class="line"></div>
							</div>
						)}
					</div>
					<div
						class={{
							'children': true,
							'on-drag': this.onDrag
						}}
						style={{ display: this.expanded ? 'block' : 'none' }}
					>
						<slot name="child-slot"></slot>
					</div>
				</div>
			</Host>
		);
	}
}

import { Component, Element, Event, EventEmitter, Fragment, h, Host, Listen, Prop, State } from '@stencil/core';
import { throttle, isNumber, isEmpty, debounce } from 'lodash-es';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { STATE_ICONS } from './tree-item.config';
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

	/** Emitted when another item drag over*/
	@Event() dragOverItem: EventEmitter<DragEvent>;

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

	private onDragOver = (event: DragEvent) => {
		if (this.onDrag) {
			return;
		}
		event.preventDefault();

		// TODO: Need to debounce and discard if is the same position

		const nodeContainerElem = this.el.shadowRoot.getElementById('content');
		const containerHeightPart = nodeContainerElem.clientHeight / 3;
		const dragPos = this.calcDargPos(event, nodeContainerElem);

		if (dragPos.y <= containerHeightPart) {
			// Drop up
			this.onDropType = EDropType.Up;
		} else if (dragPos.y <= containerHeightPart * 2) {
			// Drop inside
			this.onDropType = EDropType.Inside;
		} else if (dragPos.y <= containerHeightPart * 3) {
			if (this.hasChildrenSlot && this.expanded) {
				// Drop inside
				this.onDropType = EDropType.Inside;
			} else {
				// Drop down
				this.onDropType = EDropType.Down;
			}
		}
	};

	calcDargPos(e, obj) {
		var m_posx = 0,
			m_posy = 0,
			e_posx = 0,
			e_posy = 0;
		//get mouse position on document crossbrowser
		if (!e) {
			e = window.event;
		}
		if (e.pageX || e.pageY) {
			m_posx = e.pageX;
			m_posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			m_posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			m_posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		//get parent element position in document
		if (obj.offsetParent) {
			do {
				e_posx += obj.offsetLeft;
				e_posy += obj.offsetTop;
			} while ((obj = obj.offsetParent));
		}
		// mouse position minus elm position is mouseposition relative to element:
		return {
			x: m_posx - e_posx,
			y: m_posy - e_posy
		};
	}

	private onDragEnter = (event: DragEvent, type: EDropType) => {
		event.preventDefault();
		if (!this.onDrag) {
			console.log('onDragEnter', this.label, event);
			this.onDropType = type;
		}
	};

	private onDragLeave = debounce((event: DragEvent) => {
		event.preventDefault();
		if (!this.onDrag) {
			console.log('onDragLeave', this.label, event);
			this.onDropType = EDropType.None;
		}
	}, 10);

	private dragStart = event => {
		console.log('dragStart');
		event.stopPropagation();
		this.onDrag = true;
	};

	private dragEnd = event => {
		console.log('dragEnd');
		event.stopPropagation();
		this.onDrag = false;
	};

	private onDrop(event: DragEvent) {
		event.preventDefault();
		console.log('onDrop', this.onDropType);
		this.onDropType = EDropType.None;
	}

	render() {
		return (
			<Host>
				<div draggable={this.allowDrag} onDragStart={this.dragStart} onDragEnd={this.dragEnd} class="node-container">
					{this.onDropType === EDropType.Up && (
						<div
							class="drag-slot"
							onDrop={event => this.onDrop(event)}
							onDragOver={event => event.preventDefault()}
							onDragLeave={event => this.onDragLeave(event)}
							onDragEnter={event => this.onDragEnter(event, EDropType.Up)}
						></div>
					)}
					<div
						id="content"
						onDragLeave={event => this.onDragLeave(event)}
						onDragEnter={event => this.onDragEnter(event, EDropType.Inside)}
						onDragOver={event => this.onDragOver(event)}
						onDrop={event => this.onDrop(event)}
						class={{
							'node-wrapper': true,
							'disabled': this.disabled,
							'selected': this.selected,
							'highlighted': this.highlighted,
							'loading': this.loading,
							'no-node-gap': this.onDropType === EDropType.Up,
							'drag-over': this.onDropType === EDropType.Inside
						}}
					>
						{!this.loading && (
							<Fragment>
								{this.requiresToggleButton && (
									<div class="expander-arrow" onClick={this.toggleClickThrottler}>
										<kv-icon name={this.expanded ? EIconName.ArrowDropDown : EIconName.ArrowRight} customClass="pk-grey3 icon-24" />
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
												<kv-icon name={STATE_ICONS[this.iconState]} customClass="icon-12" class={{ 'state-icon': true, [this.iconState]: true }}></kv-icon>
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
						<div
							class="drag-slot"
							onDrop={event => this.onDrop(event)}
							onDragOver={event => event.preventDefault()}
							onDragLeave={event => this.onDragLeave(event)}
							onDragEnter={event => this.onDragEnter(event, EDropType.Down)}
						></div>
					)}
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

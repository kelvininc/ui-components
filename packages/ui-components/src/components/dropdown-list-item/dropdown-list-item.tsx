/** @inheritdoc */ import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { EOtherIconName } from '../icon/icon.types';
import { IDropdownListItem, IDropdownListItemEvents } from './dropdown-list-item.types';

@Component({
	tag: 'kv-dropdown-list-item',
	styleUrl: 'dropdown-list-item.scss',
	shadow: true
})
export class KvDropdownListItem implements IDropdownListItem, IDropdownListItemEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) value!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selected?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) togglable?: boolean = false;

	/** @inheritdoc */
	@Event() itemSelected: EventEmitter<string>;

	private onItemClick = () => {
		this.itemSelected.emit(this.value);
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'dropdown-list-item': true,
						'selected': this.selected,
						'disabled': this.disabled
					}}
					onClick={this.onItemClick}
				>
					{this.togglable && <kv-icon name={this.selected ? EOtherIconName.IconCheckState : EOtherIconName.IconUncheckState} custom-class="icon-16"></kv-icon>}
					<div class="item-label">{this.label}</div>
				</div>
			</Host>
		);
	}
}

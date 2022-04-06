import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { EOtherIconName } from '../icon/icon.types';
import { IDropdownListItem } from './dropdown-list-item.types';

@Component({
	tag: 'kv-dropdown-list-item',
	styleUrl: 'dropdown-list-item.scss',
	shadow: true
})
export class KvDropdownListItem implements IDropdownListItem {
	/** (required) The text to display on the item */
	@Prop({ reflect: true }) label!: string;
	/** (required) The item value */
	@Prop({ reflect: true }) value!: string;
	/** (optional) If `true` the item is selected */
	@Prop({ reflect: true }) selected?: boolean = false;
	/** (optional)  If `true` the item is togglable */
	@Prop({ reflect: true }) togglable?: boolean = false;

	/** Emitted when the user clicks on the item */
	@Event() itemSelected: EventEmitter<string>;

	private onItemClick = () => {
		this.selected = !this.selected;
		this.itemSelected.emit(this.value);
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'dropdown-list-item': true,
						'selected': this.selected
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

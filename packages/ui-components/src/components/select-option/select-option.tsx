/** @inheritdoc */ import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { EOtherIconName } from '../icon/icon.types';
import { ISelectOption, ISelectOptionEvents } from './select-option.types';

@Component({
	tag: 'kv-select-option',
	styleUrl: 'select-option.scss',
	shadow: true
})
export class KvSelectOption implements ISelectOption, ISelectOptionEvents {
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
						'select-option': true,
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

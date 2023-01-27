import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
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
	@Prop({ reflect: true }) hasBottomSlot?: boolean = false;

	/** @inheritdoc */
	@Event() itemSelected: EventEmitter<string>;

	private onItemClick = () => {
		if (!this.disabled) {
			this.itemSelected.emit(this.value);
		}
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'select-option': true,
						'selected': this.selected,
						'disabled': this.disabled,
						'has-bottom-slot': this.hasBottomSlot
					}}
					onClick={this.onItemClick}
				>
					{this.togglable && <kv-checkbox checked={this.selected} />}
					<div class="text-container">
						<div class="item-label">{this.label}</div>
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}

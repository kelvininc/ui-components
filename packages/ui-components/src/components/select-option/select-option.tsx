import { Component, Element, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { ISelectOption, ISelectOptionEvents } from './select-option.types';
import { isNil } from 'lodash';

@Component({
	tag: 'kv-select-option',
	styleUrl: 'select-option.scss',
	shadow: true
})
export class KvSelectOption implements ISelectOption, ISelectOptionEvents {
	@Element() el!: HTMLKvSelectOptionElement;

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
		if (!this.disabled) {
			this.itemSelected.emit(this.value);
		}
	};

	private get hasBottomSlot() {
		return !isNil(this.el.querySelector('[slot="text-bottom-slot"]'));
	}

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
					<div class="label-wrapper">
						{this.togglable && <kv-checkbox checked={this.selected} />}
						<div class="text-container">
							<div class="item-label">{this.label}</div>
							<slot name="text-bottom-slot"></slot>
						</div>
					</div>
					<slot name="text-right-slot"></slot>
				</div>
			</Host>
		);
	}
}

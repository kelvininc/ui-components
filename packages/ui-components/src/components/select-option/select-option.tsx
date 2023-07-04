import { Component, Host, h, Prop, EventEmitter, Event, Listen } from '@stencil/core';
import { ISelectOption, ISelectOptionEvents } from './select-option.types';

/**
 * @part option-container - The option's container
 * @part checkbox - The option's checkbox
 * @part label - The option's label
 */
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
	@Prop({ reflect: true }) description?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selected?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) indeterminate?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) togglable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) hasBottomSlot?: boolean = false;

	/** Listen to custom itemSelected DOM event and stop it's propagation when there are nested  */
	@Listen('itemSelected')
	tabSelectionHandler(event: CustomEvent<string>) {
		event.stopPropagation();
	}

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
					part="option-container"
					onClick={this.onItemClick}
				>
					{this.togglable && <kv-checkbox checked={this.selected} indeterminate={this.indeterminate} part="checkbox" />}
					<div class="text-container">
						<div class="item-label" part="label">
							{this.label}
						</div>
						{this.description && <div class="item-description">{this.description}</div>}
						<slot></slot>
					</div>
				</div>
				<slot name="host-bottom-slot"></slot>
			</Host>
		);
	}
}

import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { ITimePickerSelectOption, ITimePickerSelectOptionEvents } from './time-picker-select-option.types';

@Component({
	tag: 'kv-time-picker-select-option',
	styleUrl: 'time-picker-select-option.scss',
	shadow: true
})
export class KvTimePickerSelectOption implements ITimePickerSelectOption, ITimePickerSelectOptionEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) value!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selected?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) customAttributes?: Record<string, string>;

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
						'selected': this.selected
					}}
					onClick={this.onItemClick}
					{...(this.customAttributes || {})}
				>
					<div class="text-container">
						<div class="item-label">{this.label}</div>
						<div class="item-description">{this.description}</div>
					</div>
				</div>
			</Host>
		);
	}
}

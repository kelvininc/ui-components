import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { LabelsInputItem, LabelsInputItemEvents } from './labels-dropdown-input-item.types';
import { EIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-labels-dropdown-input-item',
	styleUrl: 'labels-dropdown-input-item.scss',
	shadow: true
})
export class KvLabelsDropdownInputItem implements LabelsInputItem, LabelsInputItemEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) value!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon!: EIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) selected?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;

	/** @inheritdoc */
	@Event() itemClick: EventEmitter<string>;

	private iconClickHandler = () => {
		if (!this.disabled) {
			this.itemClick.emit(this.value);
		}
	};

	render() {
		return (
			<div
				class={{
					'labels-input-item': true,
					'selected': this.selected,
					'disabled': this.disabled
				}}
			>
				<div class="label">{this.label}</div>
				<kv-icon name={this.icon} customClass="icon-12" onClick={this.iconClickHandler} />
			</div>
		);
	}
}

import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';
import { IRadioButtonGroup, IRadioButtonGroupEvents, IRadioButtonGroupButton } from './radio-button-group.types';

@Component({
	tag: 'kv-radio-button-group',
	styleUrl: 'radio-button-group.scss',
	shadow: true
})
export class KvRadioButtonGroup implements IRadioButtonGroup, IRadioButtonGroupEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) buttons: IRadioButtonGroupButton[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedButtons?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;

	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<string>;

	render() {
		return (
			<Host>
				{this.buttons.map(button => (
					<kv-radio-button
						exportparts="radio-button"
						value={button.value}
						label={button.label}
						disabled={this.disabled || button.disabled}
						checked={this.selectedButtons[button.value ?? button.label] === true}
					></kv-radio-button>
				))}
			</Host>
		);
	}
}

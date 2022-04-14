import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';
import { IRadioButton } from '../radio-button/radio-button.types';
import { IRadioButtonGroup, IRadioButtonGroupEvents } from './radio-button-group.types';

@Component({
	tag: 'kv-radio-button-group',
	styleUrl: 'radio-button-group.scss',
	shadow: true
})
export class KvRadioButtonGroup implements IRadioButtonGroup, IRadioButtonGroupEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) buttons: IRadioButton[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedButtons?: string[] = [];

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
						disabled={button.disabled}
						checked={button.checked ?? this.selectedButtons.includes(button.value ?? button.label)}
					></kv-radio-button>
				))}
			</Host>
		);
	}
}

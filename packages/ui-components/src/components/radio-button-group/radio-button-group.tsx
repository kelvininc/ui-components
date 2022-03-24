import { Component, h, Prop, Host, Listen, Event, EventEmitter } from '@stencil/core';
import { IRadioButton } from '../radio-button/radio-button.types';

@Component({
	tag: 'kv-radio-button-group',
	styleUrl: 'radio-button-group.scss',
	shadow: true
})
export class KvRadioButtonGroup {
	/** (required) List of radio buttons */
	@Prop({ reflect: true }) buttons: { [key: string]: IRadioButton } = {};

	/** When the radio button selection changes, emit the requested tab's key */
	@Event() radioButtonChange: EventEmitter<string>;

	/** Listen to custom DOM event of radio button selection */
	@Listen('checkedChange')
	radioChangeHandler(event: CustomEvent<string>) {
		this.buttons[event.detail].active = !this.buttons[event.detail].active;
		this.radioButtonChange.emit(event.detail);
	}

	render() {
		return (
			<Host>
				{Object.keys(this.buttons).map(key => (
					<kv-radio-button label={this.buttons[key].label} id={key} disabled={this.buttons[key].disabled} checked={this.buttons[key].active}></kv-radio-button>
				))}
			</Host>
		);
	}
}

import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { throttle } from 'lodash-es';
import { IRadioButton, IRadioButtonEvents } from './radio-button.types';

/**
 * @part radio-button - The radio action.
 */
@Component({
	tag: 'kv-radio-button',
	styleUrl: 'radio-button.scss',
	shadow: true
})
export class KvRadioButton implements IRadioButton, IRadioButtonEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) value: string = this.label;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) checked?: boolean = false;

	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<string>;

	private clickThrottler: () => void;
	private onCheck = () => {
		if (!this.disabled) {
			this.checkedChange.emit(this.value);
		}
	};

	connectedCallback() {
		this.clickThrottler = throttle(() => this.onCheck(), 300);
	}

	render() {
		return (
			<Host>
				<a
					class={{
						'radio-button': true,
						'radio-button--checked': this.checked,
						'radio-button--disabled': this.disabled
					}}
					part="radio-button"
					onClick={this.clickThrottler}
				>
					{this.label}
				</a>
			</Host>
		);
	}
}

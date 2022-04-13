import { Component, Host, h, Prop, EventEmitter, Event, State, Watch, Element } from '@stencil/core';
import { throttle } from 'lodash-es';

@Component({
	tag: 'kv-radio-button',
	styleUrl: 'radio-button.scss',
	shadow: true
})
export class KvRadioButton {
	/** (optional) Sets the button as checked when initializing */
	@Prop({ reflect: true }) checked?: boolean = false;

	/** Watch the `checked` property and update internal state accordingly */
	@Watch('checked')
	checkedChangeHandler(newValue?: boolean) {
		this.isChecked = newValue;
	}

	/** (optional) Sets this button styling to be disabled and disables click events */
	@Prop({ reflect: true }) disabled?: boolean = false;

	/** Watch the `disabled` property and update internal state accordingly */
	@Watch('disabled')
	disabledChangeHandler(newValue?: boolean) {
		this.isDisabled = newValue;
	}

	/** (required) Adds a label aside the button */
	@Prop({ reflect: true }) label!: string;

	/** Internal checked / unchecked state */
	@State() isChecked: boolean = this.checked;
	/** Internal enabled / disabled state */
	@State() isDisabled: boolean = this.disabled;

	/** Emits when there's a change in state internally */
	@Event() checkedChange: EventEmitter<string>;

	/** The Host's element reference */
	@Element() el: HTMLKvRadioButtonElement;

	private clickThrottler: () => void;
	private onCheck = () => {
		if (!this.disabled) {
			this.isChecked = !this.isChecked;
			this.checkedChange.emit(this.el.id);
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
						'checked': this.isChecked,
						'disabled': this.isDisabled
					}}
					onClick={this.clickThrottler}
				>
					{this.label}
				</a>
			</Host>
		);
	}
}

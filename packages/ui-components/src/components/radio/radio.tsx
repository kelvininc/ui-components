import { Component, Host, h, Prop, EventEmitter, Event, State, Watch, Listen } from '@stencil/core';
import { throttle } from 'lodash-es';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { EComponentSize } from '../../types';

@Component({
	tag: 'kv-radio',
	styleUrl: 'radio.scss',
	shadow: true
})
export class KvRadio {
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

	/** (optional) Adds a label aside the button */
	@Prop({ reflect: true }) label?: string = '';

	/** (optional) Sets this tab item to a different styling configuration */
	@Prop() size: EComponentSize = EComponentSize.Large;

	/** Internal checked / unchecked state */
	@State() isChecked: boolean = this.checked;
	/** Internal enabled / disabled state */
	@State() isDisabled: boolean = this.disabled;

	/** Emits when there's a change in state internally */
	@Event() checkedChange: EventEmitter<boolean>;

	@Listen('keydown', {
		passive: true
	})
	handleKeyDown(ev: KeyboardEvent) {
		if (ev.code === 'Space') {
			this.onCheck();
		}
	}

	private clickThrottler: () => void;
	private onCheck = () => {
		this.isChecked = true;
		this.checkedChange.emit(this.isChecked);
	};

	connectedCallback() {
		this.clickThrottler = throttle(() => this.onCheck(), DEFAULT_THROTTLE_WAIT);
	}

	render() {
		return (
			<Host>
				<div
					class={{
						'radio-container': true,
						[`radio-container--size-${this.size}`]: true,
						'checked': this.isChecked,
						'disabled': this.isDisabled
					}}
					onClick={this.clickThrottler}
				>
					<div tabIndex={this.isChecked || this.isDisabled ? -1 : 0} class="circle">
						<div class="checked-icon" />
					</div>
					{this.label && <span class="label">{this.label}</span>}
				</div>
			</Host>
		);
	}
}

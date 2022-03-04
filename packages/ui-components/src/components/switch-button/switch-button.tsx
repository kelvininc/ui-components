import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { ESwitchButtonState } from './switch-button.types';
import throttle from 'lodash/throttle';

@Component({
	tag: 'kv-switch-button',
	styleUrl: 'switch-button.scss',
	shadow: true
})
export class KvSwitchButton {
	/** (optional) Button's label */
	@Prop() label: string = '';

	/** Watch `label` property for changes and update `hasLabel` accordingly */
	@Watch('label')
	labelHandler(newValue?: string) {
		this.hasLabel = newValue != null && newValue !== '';
	}

	/** (optional) If `true` the button is disabled */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Watch `disabled` property for changes and update `isDisabled` accordingly */
	@Watch('disabled')
	disabledHandler(newValue: boolean) {
		this.isDisabled = newValue === true;
	}

	/** (optional) If `ON` the button is ON */
	@Prop({ reflect: true, mutable: true }) state: ESwitchButtonState = ESwitchButtonState.OFF;

	/** Watch `state` property for changes and update `isOn` accordingly */
	@Watch('state')
	stateHandler(newValue: ESwitchButtonState) {
		this.isOn = newValue === ESwitchButtonState.ON;
	}

	/** Whether the label exist and it's not empty */
	@State() hasLabel: boolean = this.label != null && this.label !== '';
	/** Whether the state is ON or `true` */
	@State() isOn: boolean = this.state === ESwitchButtonState.ON;
	/** Whether the state is ON or `true` */
	@State() isDisabled: boolean = this.disabled === true;

	/** Emitted when switch's state changes */
	@Event() switchStateChange: EventEmitter<ESwitchButtonState>;

	private onSwitchClick: () => void;

	private onStateChange() {
		this.state = this.isOn ? ESwitchButtonState.OFF : ESwitchButtonState.ON;
		this.switchStateChange.emit(this.state);
	}

	connectedCallback() {
		this.onSwitchClick = throttle(() => this.onStateChange(), 300);
	}

	render() {
		return (
			<Host>
				<div class="switch-button-container">
					{this.hasLabel && <span class="label">{this.label}</span>}
					<div class="switch-button-content">
						<div
							class={{
								'switch-button': true,
								'switch-button--disabled': this.isDisabled,
								'switch-button--on': this.isOn
							}}
							onClick={this.onSwitchClick}
						>
							<div class="check-square">
								<kv-svg-icon name="kv-done-all" customClass={'icon-16'} />
							</div>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}

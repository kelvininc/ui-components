import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { ESwitchButtonSize, ESwitchButtonState } from './switch-button.types';
import throttle from 'lodash/throttle';

/**
 * @part icon-svg - The switch icon.
 * @part icon-square - The switch icon square container.
 * @part button - The switch button.
 */
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
	/** (optional) Button's size */
	@Prop() size: ESwitchButtonSize = ESwitchButtonSize.Large;

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
		if (this.isDisabled) {
			return;
		}

		this.state = this.isOn ? ESwitchButtonState.OFF : ESwitchButtonState.ON;
		this.switchStateChange.emit(this.state);
	}

	connectedCallback() {
		this.onSwitchClick = throttle(() => this.onStateChange(), 300);
	}

	render() {
		const iconName = this.isDisabled ? 'kv-lock' : 'kv-done-all';

		return (
			<Host>
				<div class="switch-button-container">
					{this.hasLabel && <span class="label">{this.label}</span>}
					<div class="switch-button-content">
						<div
							class={{
								'switch-button': true,
								'switch-button--disabled': this.isDisabled,
								'switch-button--on': this.isOn,
								'switch-button--lg': this.size === ESwitchButtonSize.Large,
								'switch-button--sm': this.size === ESwitchButtonSize.Small
							}}
							part="button"
							onClick={this.onSwitchClick}
						>
							<div class="icon-square" part="icon-square">
								<kv-svg-icon name={iconName} part="icon-svg" />
							</div>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}

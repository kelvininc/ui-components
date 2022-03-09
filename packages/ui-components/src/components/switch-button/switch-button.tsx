import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EComponentSize } from '../../utils/types';
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
	/** (optional) If `true` the button is ON */
	@Prop({ reflect: true, mutable: true }) checked: boolean = false;
	/** (optional) Button's size */
	@Prop() size: EComponentSize = EComponentSize.Large;

	/** Whether the label exist and it's not empty */
	@State() hasLabel: boolean = this.label != null && this.label !== '';

	/** Emitted when switch's state changes */
	@Event() switchChange: EventEmitter<boolean>;

	private onSwitchClick: () => void;

	private onStateChange() {
		if (this.disabled) {
			return;
		}

		this.checked = !this.checked;
		this.switchChange.emit(this.checked);
	}

	connectedCallback() {
		this.onSwitchClick = throttle(() => this.onStateChange(), 300);
	}

	render() {
		const iconName = this.disabled ? 'kv-lock' : 'kv-done-all';

		return (
			<Host>
				<div class="switch-button-container">
					{this.hasLabel && <span class="label">{this.label}</span>}
					<div class="switch-button-content">
						<div
							class={{
								'switch-button': true,
								'switch-button--disabled': this.disabled,
								'switch-button--on': this.checked,
								[`switch-button--${this.size}`]: true
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

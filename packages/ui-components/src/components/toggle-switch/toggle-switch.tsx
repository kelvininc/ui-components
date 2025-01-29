import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';
import { IToggleSwitch, IToggleSwitchEvents, IToggleSwitchOption } from './toggle-switch.types';
import { EComponentSize } from '../../types';

/**
 * @part toggle-options-container - Container of toggle options.
 */
@Component({
	tag: 'kv-toggle-switch',
	styleUrl: 'toggle-switch.scss',
	shadow: true
})
export class KvToggleSwitch implements IToggleSwitch, IToggleSwitchEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) options: IToggleSwitchOption[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOption?: string = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) disabledButtons?: Record<string, boolean> = {};

	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<string>;

	render() {
		return (
			<Host>
				<div class="toggle-switch-container">
					{this.options.map(option => (
						<kv-toggle-button
							part="toggle-switch-option-container"
							exportparts="toggle-button"
							value={option.key}
							label={option.label}
							size={this.size}
							disabled={this.disabled ?? this.disabledButtons[option.key] ?? option.disabled}
							checked={this.selectedOption === option.key}
						/>
					))}
				</div>
			</Host>
		);
	}
}

import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';
import { IToggleButton } from '../toggle-button/toggle-button.types';
import { IToggleButtonGroup, IToggleButtonGroupEvents } from './toggle-button-group.types';
import { EComponentSize } from '../../types';

/**
 * @part toggle-button-container - Container of toggle button.
 */
@Component({
	tag: 'kv-toggle-button-group',
	styleUrl: 'toggle-button-group.scss',
	shadow: true
})
export class KvToggleButtonGroup implements IToggleButtonGroup, IToggleButtonGroupEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) buttons: IToggleButton[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) withRadio?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedButtons?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) disabledButtons?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) radioButtons?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<string>;

	render() {
		return (
			<Host>
				{this.buttons.map(button => (
					<kv-toggle-button
						part="toggle-button-container"
						exportparts="toggle-button"
						icon={button.icon}
						value={button.value}
						label={button.label}
						tooltip={button.tooltip}
						size={this.size ?? button.size}
						preventDefault={button.preventDefault}
						checked={this.selectedButtons[button.value] || button.checked}
						disabled={this.disabled || this.disabledButtons[button.value] || button.disabled}
						withRadio={this.withRadio || this.radioButtons[button.value] || button.withRadio}
					/>
				))}
			</Host>
		);
	}
}

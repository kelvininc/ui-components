import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';
import { IToggleButton } from '../toggle-button/toggle-button.types';
import { IToggleButtonGroup, IToggleButtonGroupEvents } from './toggle-button-group.types';

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
						exportparts="toggle-button"
						value={button.value}
						label={button.label}
						icon={button.icon}
						download={button.download}
						href={button.href}
						target={button.target}
						preventDefault={button.preventDefault}
						disabled={this.disabled || this.disabledButtons[button.value] || button.disabled}
						checked={this.selectedButtons[button.value]}
						withRadio={this.withRadio || this.radioButtons[button.value]}
					/>
				))}
			</Host>
		);
	}
}

import { Component, Element, h, Prop, Host, Event, EventEmitter, Method } from '@stencil/core';
import { IToggleButton } from '../toggle-button/toggle-button.types';
import { IToggleButtonGroup, IToggleButtonGroupEvents } from './toggle-button-group.types';
import { EComponentSize, ERadioControlType } from '../../types';
import { focusRadioGroup, getRadioGroupTabStop, handleRadioGroupKeyDown, RadioGroupOption } from '../../utils/radio-group.helper';

/**
 * @part toggle-button-container - Container of toggle button.
 */
@Component({
	tag: 'kv-toggle-button-group',
	styleUrl: 'toggle-button-group.scss',
	shadow: true
})
export class KvToggleButtonGroup implements IToggleButtonGroup, IToggleButtonGroupEvents {
	@Element() el: HTMLKvToggleButtonGroupElement;

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
	@Prop() radioControlType?: ERadioControlType = ERadioControlType.Radio;
	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<string | number>;

	/** Focuses the current radio Tab stop, or the first enabled checkbox/plain button. */
	@Method()
	async setFocus(): Promise<void> {
		const hosts = Array.from(this.el.shadowRoot?.querySelectorAll<HTMLElement>('kv-toggle-button') ?? []);
		const options = this.isRadioGroup() ? this.getGroupOptions() : this.buttons.map(button => ({ value: button.value, disabled: this.isButtonDisabled(button) }));
		focusRadioGroup(options, hosts);
	}

	private isButtonDisabled = (button: IToggleButton) => !!(this.disabled || this.disabledButtons[button.value] || button.disabled);

	private hasRadio = (button: IToggleButton) => !!(this.withRadio || this.radioButtons[button.value] || button.withRadio);

	private getRadioControlType = (button: IToggleButton) => button.radioControlType ?? this.radioControlType ?? ERadioControlType.Radio;

	// The group is a radio group when its buttons show radios that behave as radios. When pressing a
	// checked button unchecks it, or several can be checked, they're checkboxes, which need no group role
	private isRadioGroup = () => {
		const radios = this.buttons.filter(this.hasRadio);
		return radios.length > 0 && radios.every(button => this.getRadioControlType(button) === ERadioControlType.Radio);
	};

	private getGroupOptions = (): RadioGroupOption[] =>
		this.buttons.map(button => ({
			value: button.value,
			checked: !!(this.selectedButtons[button.value] || button.checked),
			disabled: !this.hasRadio(button) || this.isButtonDisabled(button)
		}));

	private onKeyDown = (event: KeyboardEvent) => {
		if (!this.isRadioGroup()) return;
		const hosts = Array.from(this.el.shadowRoot?.querySelectorAll<HTMLElement>('kv-toggle-button') ?? []);
		handleRadioGroupKeyDown(event, this.getGroupOptions(), hosts, value => this.checkedChange.emit(value));
	};

	render() {
		const isRadioGroup = this.isRadioGroup();
		const tabStop = isRadioGroup ? getRadioGroupTabStop(this.getGroupOptions()) : -1;
		return (
			<Host role={isRadioGroup ? 'radiogroup' : undefined} onKeyDown={this.onKeyDown}>
				{this.buttons.map((button, index) => (
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
						disabled={this.isButtonDisabled(button)}
						withRadio={this.hasRadio(button)}
						radioControlType={this.getRadioControlType(button)}
						skipTabStop={isRadioGroup && index !== tabStop}
						customAttributes={button.customAttributes}
					/>
				))}
			</Host>
		);
	}
}

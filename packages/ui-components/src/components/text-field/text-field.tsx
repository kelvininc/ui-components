import { Component, Event, EventEmitter, Fragment, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EComponentSize } from '../../utils/types';
import { EInputFieldType, EValidationState } from './text-field.types';

@Component({
	tag: 'kv-text-field',
	styleUrls: {
		night: 'text-field.night.scss',
		light: 'text-field.light.scss'
	},
	shadow: true
})
export class KvTextField {
	/** (optional) Text field type */
	@Prop({ reflect: true }) type!: EInputFieldType;
	/** (optional) Text field label */
	@Prop({ reflect: true }) label: string;
	/** (optional) Text field's icon symbol name */
	@Prop({ reflect: true }) icon: string;
	/** (optional) Text field input name */
	@Prop({ reflect: true }) inputName: string;
	/** (optional) Text field place holder */
	@Prop({ reflect: true }) placeholder: string;
	/** (optional) Sets this tab item to a different styling configuration */
	@Prop() size?: EComponentSize = EComponentSize.Large;
	/** (optional) Text field disabled */
	@Prop({ reflect: true }) disabled = false;
	/** (optional) Text field required */
	@Prop({ reflect: true }) required = false;
	/** (optional) Text field loading state */
	@Prop({ reflect: true }) loading = false;
	/** (optional) Text field state */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;

	/** (optional) Text field help text */
	@Prop({ reflect: true }) helpText: string | string[] = [];
	/** Internal help texts state */
	@State() _helpTexts: string[] = this.buildHelpTextMessages(this.helpText);
	/** Watch the `helpText` property and update internal state accordingly */
	@Watch('helpText')
	helpTextChangeHandler(newValue: string | string[]) {
		this._helpTexts = this.buildHelpTextMessages(newValue);
	}

	/** Text field value */
	@Prop({ reflect: true }) value: string;
	/** Text field value state */
	@State() _value: string;
	/** Watch `value` property for changes and update `_value` accordingly */
	@Watch('value')
	valueChangeHandler(newValue: string) {
		this._value = newValue;
	}

	/** Text field focus state */
	@State() focused = false;

	/** Emitted when text field's value changes */
	@Event() textChange: EventEmitter<string>;
	/** Emitted when text field lost focus */
	@Event() textFieldBlur: EventEmitter<string>;

	private onInputHandler = event => {
		this._value = event.target.value;
		this.textChange.emit(this._value);
	};

	private onBlurHandler = event => {
		this._value = event.target.value;
		this.textFieldBlur.emit(this._value);
		this.focused = false;
	};

	private onFocusHandler = () => {
		this.focused = true;
	};

	private buildHelpTextMessages(value: string | string[]) {
		value = value || [];
		return Array.isArray(value) ? value : [value];
	}

	render() {
		return (
			<Host>
				<div class="text-field-container">
					{this.required && <span class="required">*</span>}
					{this.label && <span class="label">{this.label}</span>}
					<div
						class={{
							'input-container': true,
							[`input-container--size-${this.size}`]: true
						}}
					>
						{!this.loading && (
							<Fragment>
								<input
									type={this.type}
									name={this.inputName}
									placeholder={this.placeholder}
									disabled={this.disabled}
									value={this._value}
									onInput={this.onInputHandler}
									onBlur={this.onBlurHandler}
									onFocus={this.onFocusHandler}
									class={{
										'invalid': this.state === EValidationState.Invalid,
										'has-icon': !isEmpty(this.icon)
									}}
								/>
								{this.icon && (
									<kv-svg-icon
										name={this.icon}
										exportparts="icon"
										class={{
											invalid: this.state === EValidationState.Invalid,
											disabled: this.disabled,
											focus: this.focused
										}}
									/>
								)}
							</Fragment>
						)}
						{this.loading && <div class="input-container-loading"></div>}
					</div>
					{!isEmpty(this._helpTexts) && (
						<div class={{ 'help-text-container': true, 'invalid': this.state === EValidationState.Invalid }}>
							{this.state === EValidationState.Invalid && <kv-svg-icon name="kv-error" customClass="icon-16"></kv-svg-icon>}
							{this._helpTexts.map(msg => (
								<span class="help-text">{msg}</span>
							))}
						</div>
					)}
				</div>
			</Host>
		);
	}
}

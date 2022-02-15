import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { EInputFieldType } from './text-field.types';

@Component({
	tag: 'kv-text-field',
	styleUrl: 'text-field.scss',
	shadow: true
})
export class KvTextField {
	/** (optional) Text field type */
	@Prop({ reflect: true }) type!: EInputFieldType;
	/** (optional) Text field label */
	@Prop({ reflect: true }) label: string;
	/** (optional) Text field input name */
	@Prop({ reflect: true }) inputName: string;
	/** (optional) Text field place holder */
	@Prop({ reflect: true }) placeholder: string;
	/** (optional) Text field disabled */
	@Prop({ reflect: true }) disabled = false;
	/** (optional) Text field required */
	@Prop({ reflect: true }) required = false;
	/** (optional) Text field loading state */
	@Prop({ reflect: true }) loading = false;
	/** (optional) Text field help text */
	@Prop({ reflect: true }) helpText: string;
	/** (optional) Text field slim style */
	@Prop({ reflect: true }) slim = false;
	/** Text field value */
	@Prop({ reflect: true }) value: string;
	/** Text field value state */
	@State() _value: string;
	/** Watch `value` property for changes and update `_value` accordingly */
	@Watch('value')
	valueChangeHandler(newValue: string) {
		this._value = newValue;
	}
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
	};

	render() {
		return (
			<Host>
				<div class="text-field-container">
					{this.required && <span class="error">*</span>}
					{this.label && <span class="label">{this.label}</span>}
					<div class="input-container">
						{!this.loading && (
							<input
								type={this.type}
								name={this.inputName}
								placeholder={this.placeholder}
								disabled={this.disabled}
								value={this._value}
								onInput={this.onInputHandler}
								onBlur={this.onBlurHandler}
								class={{ 'kv-slim-text-field': this.slim }}
							/>
						)}
						{this.loading && <div class={this.slim ? 'input-container-loading kv-slim-text-field' : 'input-container-loading'}></div>}
					</div>
					<div class="text-container">{this.helpText && <div class="text-elem">{this.helpText}</div>}</div>
				</div>
			</Host>
		);
	}
}

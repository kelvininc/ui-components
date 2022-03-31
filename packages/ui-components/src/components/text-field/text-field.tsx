import { Component, Element, Event, EventEmitter, Fragment, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EComponentSize } from '../../utils/types';
import { EInputFieldType, EValidationState, ITextFieldEvents } from './text-field.types';
import { EIconName, EOtherIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-text-field',
	styleUrls: {
		night: 'text-field.night.scss',
		light: 'text-field.light.scss'
	},
	shadow: true
})
export class KvTextField implements ITextFieldEvents {
	@Element() el!: HTMLKvTextFieldElement;
	/** (optional) Text field type */
	@Prop({ reflect: true }) type!: EInputFieldType;
	/** (optional) Text field label */
	@Prop({ reflect: true }) label: string;
	/** (optional) Text field's icon symbol name */
	@Prop({ reflect: true }) icon: EIconName | EOtherIconName;
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
	@State() _helpTexts: string[];
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

	componentWillLoad() {
		// Init the states because Watches run only on component updates
		this._value = this.value;
		this._helpTexts = this.buildHelpTextMessages(this.helpText);
	}

	/** Text field focus state */
	@State() focused = false;

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
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

	private get hasRightSlot() {
		return !!this.el.querySelector('[slot="right-slot"]');
	}

	render() {
		const hasLabel = !isEmpty(this.label);
		const shouldShowLabel = this.required || hasLabel;

		return (
			<Host>
				<div class="text-field-container">
					{shouldShowLabel && (
						<div class="label-container">
							{this.required && <span class="required">*</span>}
							{this.label && <span class="label">{this.label}</span>}
						</div>
					)}
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
										'has-icon': !isEmpty(this.icon),
										'slotted': this.hasRightSlot
									}}
								/>
								{this.icon && (
									<kv-icon
										name={this.icon}
										exportparts="icon"
										class={{
											invalid: this.state === EValidationState.Invalid,
											disabled: this.disabled,
											focus: this.focused
										}}
									/>
								)}
								<div class={{ 'right-slot-container': true, 'focus': this.focused }}>
									<slot name="right-slot"></slot>
								</div>
							</Fragment>
						)}
						{this.loading && <div class="input-container-loading"></div>}
					</div>
					{!isEmpty(this._helpTexts) && (
						<div class={{ 'help-text-container': true, 'invalid': this.state === EValidationState.Invalid }}>
							{this.state === EValidationState.Invalid && <kv-icon name={EIconName.Error} customClass="icon-16"></kv-icon>}
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

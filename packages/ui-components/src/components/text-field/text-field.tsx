import { Component, Element, Event, EventEmitter, Fragment, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EComponentSize } from '../../utils/types';
import { EInputFieldType, EValidationState, ITextFieldEvents, ITextField } from './text-field.types';
import { EIconName, EOtherIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-text-field',
	styleUrls: {
		night: 'text-field.night.scss',
		light: 'text-field.light.scss'
	},
	shadow: true
})
export class KvTextField implements ITextField, ITextFieldEvents {
	@Element() el!: HTMLKvTextFieldElement;
	/** @inheritdoc */
	@Prop({ reflect: true }) type: EInputFieldType = EInputFieldType.Text;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputName?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxLength?: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) minLength?: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) max?: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) min?: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) step?: number;
	/** @inheritdoc */
	@Prop() size: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) required: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText: string | string[] = [];
	/** Internal help texts state */
	@State() _helpTexts: string[];
	/** Watch the `helpText` property and update internal state accordingly */
	@Watch('helpText')
	helpTextChangeHandler(newValue: string | string[]) {
		this._helpTexts = this.buildHelpTextMessages(newValue);
	}

	/** @inheritdoc */
	@Prop({ reflect: true }) value?: string;
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

	private onInputHandler = (event: InputEvent) => {
		this._value = (event.target as HTMLInputElement).value;
		this.textChange.emit(this._value);
	};

	private onBlurHandler = (event: FocusEvent) => {
		this._value = (event.target as HTMLInputElement).value;
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
									max={this.max}
									min={this.min}
									maxlength={this.maxLength}
									minlength={this.minLength}
									step={this.step}
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

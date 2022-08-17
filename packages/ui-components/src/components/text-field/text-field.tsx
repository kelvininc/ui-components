import { Component, Element, Event, EventEmitter, Fragment, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty, isNil } from 'lodash-es';
import Inputmask from 'inputmask';
import { EComponentSize, ETooltipPosition } from '../../utils/types';
import { EInputFieldType, EValidationState, ITextFieldEvents, ITextField } from './text-field.types';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { NUMERIC_TEXT_INPUT_MASK_CONFIG } from './text-field.config';

@Component({
	tag: 'kv-text-field',
	styleUrls: {
		night: 'text-field.night.scss',
		light: 'text-field.light.scss'
	},
	shadow: true
})
export class KvTextField implements ITextField, ITextFieldEvents {
	private nativeInput?: HTMLInputElement;

	@Element() el!: HTMLKvTextFieldElement;
	/** @inheritdoc */
	@Prop({ reflect: true }) type: EInputFieldType = EInputFieldType.Text;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) examples?: string[];
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
	@Prop({ reflect: true }) max?: string | number;
	/** @inheritdoc */
	@Prop({ reflect: true }) min?: string | number;
	/** @inheritdoc */
	@Prop({ reflect: true }) step?: string | number;
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
	@Prop({ reflect: true }) uneditable: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) forcedFocus: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) tooltip?: string;
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) value?: string | number | null = '';
	/** Watch `value` property for changes and update native input element accordingly */
	@Watch('value')
	valueChangeHandler(newValue: string | number | null) {
		this.value = newValue;

		const nativeInput = this.nativeInput;
		const value = this.getValue();

		if (nativeInput && nativeInput.value !== value) {
			/**
			 * Assigning the native input's value on attribute
			 * value change, allows `textChange` implementations
			 * to override the control's value.
			 *
			 * Used for patterns such as input trimming (removing whitespace),
			 * or input masking.
			 */
			nativeInput.value = value;
		}
	}

	/** Internal help texts state */
	@State() _helpTexts: string[];
	/** Watch the `helpText` property and update internal state accordingly */
	@Watch('helpText')
	helpTextChangeHandler(newValue: string | string[]) {
		this._helpTexts = this.buildHelpTextMessages(newValue);
	}
	/** Watch the `forcedFocus` property and update internal state accordingly */
	@Watch('forcedFocus')
	forcedFocusChangeHandler(newValue: boolean) {
		this.focused = newValue;

		if (!this.focused) {
			this.el.blur();
		}
	}

	componentWillLoad() {
		// Init the states because Watches run only on component updates
		this._helpTexts = this.buildHelpTextMessages(this.helpText);
		this.focused = this.forcedFocus;
	}

	componentDidLoad() {
		if (this.type === EInputFieldType.Number) {
			return Inputmask({
				...NUMERIC_TEXT_INPUT_MASK_CONFIG,
				min: this.min,
				max: this.max
			}).mask(this.nativeInput);
		}
	}

	/** Text field focus state */
	@State() focused = false;

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() textFieldBlur: EventEmitter<string>;

	private onInputHandler = ({ target }: InputEvent) => {
		const input = target as HTMLInputElement | null;
		if (!isNil(input)) {
			this.value = input.value || '';
		}
		this.textChange.emit(this.getValue());
	};

	private onBlurHandler = ({ target }: FocusEvent) => {
		if (this.forcedFocus) {
			return;
		}

		this.textFieldBlur.emit((target as HTMLInputElement).value);
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
		return !isNil(this.el.querySelector('[slot="right-slot"]'));
	}

	private getValue(): string {
		return typeof this.value === 'number' ? this.value.toString() : (this.value || '').toString();
	}

	private getType(): string {
		return this.type === EInputFieldType.Number ? EInputFieldType.Text : this.type;
	}

	render() {
		const id = this.el.getAttribute('id');
		const value = this.getValue();
		const type = this.getType();

		return (
			<Host>
				<kv-tooltip text={this.tooltip} position={ETooltipPosition.TopStart}>
					<div class="text-field-container">
						<kv-form-label label={this.label} required={this.required}></kv-form-label>
						<div
							class={{
								'input-container': true,
								[`input-container--size-${this.size}`]: true
							}}
						>
							{!this.loading && (
								<Fragment>
									<input
										id={id}
										ref={input => (this.nativeInput = input)}
										type={type}
										list={!isNil(this.examples) ? `examples_${id}` : undefined}
										name={this.inputName}
										placeholder={this.placeholder}
										disabled={this.disabled}
										max={this.max}
										min={this.min}
										maxLength={this.maxLength}
										minLength={this.minLength}
										step={this.step}
										value={value}
										onInput={this.onInputHandler}
										onBlur={this.onBlurHandler}
										onFocus={this.onFocusHandler}
										class={{
											'invalid': this.state === EValidationState.Invalid,
											'has-icon': !isEmpty(this.icon),
											'slotted': this.hasRightSlot,
											'forced-focus': this.focused
										}}
										readonly={this.uneditable}
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
									{this.hasRightSlot && (
										<div class={{ 'right-slot-container': true, 'focus': this.focused }}>
											<slot name="right-slot"></slot>
										</div>
									)}
								</Fragment>
							)}
							{this.loading && <div class="input-container-loading"></div>}
						</div>
						<kv-form-help-text helpText={this._helpTexts} state={this.state}></kv-form-help-text>
					</div>
					{!isEmpty(this.examples) ? (
						<datalist id={`examples_${id}`}>
							{this.examples.map(example => (
								<option key={example} value={example}></option>
							))}
						</datalist>
					) : null}
				</kv-tooltip>
			</Host>
		);
	}
}

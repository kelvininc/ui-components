import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty, isNil, merge } from 'lodash-es';
import { EComponentSize } from '../../utils/types';
import { EInputFieldType, EValidationState, ITextFieldEvents, ITextField, IInputMaskInstanceRef } from './text-field.types';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { DEFAULT_TEXT_TOOLTIP_CONFIG } from './text-field.config';
import { ITooltip } from '../tooltip/tooltip.types';
import { buildInputMask, getValueAsString, isInputMaskCompatibleType } from './text-field.utils';
import Inputmask from 'inputmask';
import { getUTF8StringLength } from '../../utils/string.helper';
import { EBadgeState } from '../../types';

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
	private maskInstance: IInputMaskInstanceRef;

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
	@Prop({ reflect: true }) actionIcon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputName?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string = '';
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
	@Prop() size?: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) required: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) readonly: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) forcedFocus: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) tooltipConfig?: Partial<ITooltip>;
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) value?: string | number | null = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) valuePrefix?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) badge?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) useInputMask?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputMaskRegex?: string = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) fitContent?: boolean = true;

	/** Watch `value` property for changes and update native input element accordingly */
	@Watch('value')
	valueChangeHandler(newValue: string | number | null) {
		const newStringValue = getValueAsString(newValue);

		if (this.nativeInput && this.nativeInput.value !== newStringValue) {
			/**
			 * Assigning the native input's value on attribute
			 * value change, allows `textChange` implementations
			 * to override the control's value.
			 *
			 * Used for patterns such as input trimming (removing whitespace),
			 * or input masking.
			 */
			this.updateAndEmitValue(newStringValue);
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
			this.nativeInput.blur();
		} else {
			this.el.focus();
			this.nativeInput.focus();
		}
	}

	@Watch('useInputMask')
	handleUseInputMask(newValue: boolean = this.type === EInputFieldType.Number) {
		if (newValue && isInputMaskCompatibleType(this.type) && !this.maskInstance) {
			this.maskInstance = buildInputMask(
				this.nativeInput,
				this.type,
				{
					min: this.getMinValue(),
					max: this.getMaxValue(),
					regex: this.inputMaskRegex
				},
				this.maxLength
			);
			this.maskInstance.shadowRoot = this.el.shadowRoot;
		} else {
			if (this.nativeInput) {
				Inputmask.remove(this.nativeInput);
				this.valueChangeHandler(this.value);
			}
		}
	}

	componentWillLoad() {
		// Init the states because Watches run only on component updates
		this._helpTexts = this.buildHelpTextMessages(this.helpText);
		this.focused = this.forcedFocus;
	}

	componentDidLoad() {
		this.handleUseInputMask(this.getUseInputMask());
		this.updateAndEmitValue(this.getValue());
		if (!this.focused) {
			this.el.blur();
			this.nativeInput?.blur();
		} else {
			this.el.focus();
			this.nativeInput?.focus();
		}
	}

	/** Text field focus state */
	@State() focused = false;

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() textFieldBlur: EventEmitter<string>;
	/** @inheritdoc */
	@Event() rightActionClick: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() fieldClick: EventEmitter<MouseEvent>;

	private onHostClick = (event: MouseEvent) => {
		if (this.disabled) return;
		event.preventDefault();
		this.fieldClick.emit();
	};

	private onRightActionClick = (event: MouseEvent) => {
		event.preventDefault();
		this.rightActionClick.emit();
	};

	private onInputHandler = ({ target }: InputEvent) => {
		const input = target as HTMLInputElement | null;

		if (this.maxLength && getUTF8StringLength(input.value) > this.maxLength) {
			const caretPositionIdx = input.selectionStart - 1;
			input.value = this.getValue().substring(0, this.maxLength);
			input.setSelectionRange(caretPositionIdx, caretPositionIdx);
			return;
		}

		if (!isNil(input)) {
			this.value = input.value || '';
		}

		this.textChange.emit(this.getValue());
	};

	private onPasteHandler = (event: ClipboardEvent) => {
		const textLength = getUTF8StringLength(this.nativeInput.value);
		const pasteData = event.clipboardData.getData('text/plain');
		const shouldDisablePaste = this.maxLength && textLength + getUTF8StringLength(pasteData) > this.maxLength;

		if (shouldDisablePaste) {
			event.preventDefault();
		}
	};

	private onBlurHandler = ({ target }: FocusEvent) => {
		this.textFieldBlur.emit((target as HTMLInputElement).value);

		if (this.forcedFocus) {
			return;
		}

		this.focused = false;
	};

	private onFocusHandler = () => {
		this.focused = true;
	};

	private updateAndEmitValue(newString: string) {
		this.value = this.maxLength ? newString.substring(0, this.maxLength) : newString;

		if (this.nativeInput && this.nativeInput.value) {
			this.nativeInput.value = this.value;
		}

		if (this.value !== newString) {
			this.textChange.emit(this.value);
		}
	}

	private buildHelpTextMessages(value: string | string[]) {
		value = value || [];
		return Array.isArray(value) ? value : [value];
	}

	private getValue(): string {
		return getValueAsString(this.value);
	}

	private getType(): string {
		return this.getUseInputMask() ? EInputFieldType.Text : this.type;
	}

	private getTooltipConfig = (): Partial<ITooltip> => {
		return merge({}, DEFAULT_TEXT_TOOLTIP_CONFIG, this.tooltipConfig ?? {});
	};

	private getMinValue = (): number | string | undefined => {
		if (this.min !== undefined) {
			return this.min;
		}

		if (this.type === EInputFieldType.Number) {
			return Number.MIN_SAFE_INTEGER;
		}
	};

	private getMaxValue = (): number | string | undefined => {
		if (this.max !== undefined) {
			return this.max;
		}

		if (this.type === EInputFieldType.Number) {
			return Number.MAX_SAFE_INTEGER;
		}
	};

	private getUseInputMask = (): boolean => {
		return this.useInputMask ?? this.type === EInputFieldType.Number;
	};

	render() {
		const id = this.el.getAttribute('id');
		const value = this.getValue();
		const type = this.getType();

		return (
			<Host onClick={this.onHostClick}>
				<kv-tooltip {...this.getTooltipConfig()}>
					<div class="text-field-container">
						<kv-form-label label={this.label} required={this.required}></kv-form-label>
						{!this.loading ? (
							<div
								part="input-container"
								class={{
									'input-container': true,
									[`input-container--size-${this.size}`]: true,
									'invalid': this.state === EValidationState.Invalid,
									'focused': this.focused,
									'disabled': this.disabled
								}}
							>
								<div
									class={{
										'left-slot-container': true,
										'focus': this.focused,
										'invalid': this.state === EValidationState.Invalid,
										'disabled': this.disabled
									}}
								>
									<slot name="left-slot">
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
										{value && this.valuePrefix && <div class="value-prefix">{this.valuePrefix}</div>}
									</slot>
								</div>
								<div class="resize-container">
									{this.fitContent && <span class="resize-text">{value || this.placeholder}</span>}
									<input
										ref={input => (this.nativeInput = input as HTMLInputElement)}
										type={type}
										list={!isNil(this.examples) ? `examples_${id}` : undefined}
										name={this.inputName}
										placeholder={this.placeholder}
										disabled={this.disabled}
										max={this.getMaxValue()}
										min={this.getMinValue()}
										minLength={this.minLength}
										step={this.step}
										value={value}
										onInput={this.onInputHandler}
										onBlur={this.onBlurHandler}
										onFocus={this.onFocusHandler}
										onPaste={this.onPasteHandler}
										class={{ 'resize-input': true, 'forced-focus': this.focused }}
										readonly={this.readonly}
									/>
								</div>
								<div
									class={{
										'right-slot-container': true,
										'focus': this.focused,
										'disabled': this.disabled
									}}
								>
									<slot name="right-slot">
										{this.badge && <kv-badge state={EBadgeState.Info}>{this.badge}</kv-badge>}
										{this.actionIcon && (
											<kv-icon
												name={this.actionIcon}
												onClick={this.onRightActionClick}
												class={{
													invalid: this.state === EValidationState.Invalid,
													disabled: this.disabled,
													focus: this.focused
												}}
											/>
										)}
									</slot>
								</div>
							</div>
						) : (
							<div class={{ 'input-container-loading': true, [`input-container-loading--size-${this.size}`]: true }} />
						)}
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

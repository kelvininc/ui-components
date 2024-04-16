import { Component, Element, Event, EventEmitter, Fragment, Host, Prop, State, Watch, h } from '@stencil/core';
import { EInputFieldType, EValidationState } from '../text-field/text-field.types';
import { EComponentSize, EIconName, EOtherIconName } from '../../types';
import { isNil, merge } from 'lodash';
import { DATE_TIME_INPUTMASK_CONFIG, DEFAULT_DATE_FORMAT, DEFAULT_PLACEHOLDER } from './date-time-input.config';
import { EDateTimeInputTypeStyle, IDateTimeInput, IDateTimeInputEvents } from './date-time-input.types';
import Inputmask from 'inputmask';

@Component({
	tag: 'kv-date-time-input',
	styleUrl: 'date-time-input.scss',
	shadow: false
})
export class KvDateTimeInput implements IDateTimeInput, IDateTimeInputEvents {
	@Element() el!: HTMLKvDateTimeInputElement;

	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputName?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string = DEFAULT_PLACEHOLDER;
	/** @inheritdoc */
	@Prop({ reflect: true }) dateFormat?: string = DEFAULT_DATE_FORMAT;
	/** @inheritdoc */
	@Prop({ reflect: true }) value?: string | null = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) useInputMask?: boolean = false;
	/** @inheritdoc */
	@Prop() size: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) forcedFocus: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) highlighted: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) required: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) inputStyleType?: EDateTimeInputTypeStyle = EDateTimeInputTypeStyle.Separated;
	/** @inheritdoc */
	@Prop({ reflect: true }) leftIcon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) rightIcon?: EIconName | EOtherIconName;

	@State() focused = false;

	private nativeInput?: HTMLInputElement;

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() dateTimeBlur: EventEmitter<string>;
	/** @inheritdoc */
	@Event() inputFocus: EventEmitter<FocusEvent>;
	/** @inheritdoc */
	@Event() rightIconClick: EventEmitter<string>;

	@Watch('forcedFocus')
	forcedFocusChangeHandler(newValue: boolean) {
		this.focused = newValue;

		if (!this.focused) {
			this.el.blur();
		}
	}

	@Watch('useInputMask')
	handleUseInputMask(useInputMaskValue: boolean) {
		if (useInputMaskValue) {
			this.createInputMaskInstance();
		} else if (this.nativeInput) {
			Inputmask.remove(this.nativeInput);
		}
	}

	componentWillLoad() {
		this.focused = this.forcedFocus;
	}

	componentDidLoad() {
		this.handleUseInputMask(this.useInputMask);
	}

	private getInputMaskConfig = () => {
		return merge({}, DATE_TIME_INPUTMASK_CONFIG, { inputFormat: this.dateFormat, displayFormat: this.dateFormat, placeholder: this.placeholder });
	};

	private createInputMaskInstance = () => {
		Inputmask(this.getInputMaskConfig()).mask(this.nativeInput);
	};

	private onInputHandler = ({ target }: InputEvent) => {
		const input = target as HTMLInputElement | null;
		if (!isNil(input) && input?.value !== this.value) {
			this.textChange.emit(input.value || '');
		}
	};

	private onBlurHandler = ({ target }: FocusEvent) => {
		this.dateTimeBlur.emit((target as HTMLInputElement).value);
		this.focused = false;
	};

	private onFocusHandler = (event: FocusEvent) => {
		this.focused = true;
		this.inputFocus.emit(event);
	};

	private onRightIconClickHandler = event => {
		this.rightIconClick.emit(event);
	};

	private getValue(): string {
		return (this.value || '').toString();
	}

	render() {
		const id = this.el.getAttribute('id');
		const value = this.getValue();

		return (
			<Host>
				<div class="date-time-input-container">
					<kv-form-label label={this.label} required={this.required} />
					<div
						class={{
							'input-container-wrapper': true,
							[`input-container-wrapper--style-${this.inputStyleType}`]: true,
							[`input-container-wrapper--size-${this.size}`]: true
						}}
					>
						<div
							class={{
								'input-container': true,
								['forced-focus']: (this.focused || this.forcedFocus || this.highlighted) && !this.disabled,
								['invalid']: this.state === EValidationState.Invalid
							}}
						>
							<Fragment>
								<div class="left-container">
									{this.leftIcon && (
										<div class="left-icon">
											<kv-icon
												name={this.leftIcon}
												exportparts="icon"
												class={{
													invalid: this.state === EValidationState.Invalid,
													disabled: this.disabled,
													focus: this.focused || this.forcedFocus
												}}
											/>
										</div>
									)}
									<input
										id={id}
										ref={input => (this.nativeInput = input as HTMLInputElement)}
										type={EInputFieldType.Text}
										name={this.inputName}
										disabled={this.disabled}
										placeholder={this.placeholder}
										value={value}
										onInput={this.onInputHandler}
										onBlur={this.onBlurHandler}
										onFocus={this.onFocusHandler}
										class={{ 'forced-focus': this.focused || this.forcedFocus }}
									/>
								</div>
								{this.rightIcon && (
									<div class="right-icon" onClick={this.onRightIconClickHandler}>
										<kv-icon
											name={this.rightIcon}
											exportparts="icon"
											class={{
												invalid: this.state === EValidationState.Invalid,
												disabled: this.disabled,
												focus: this.focused || this.forcedFocus
											}}
										/>
									</div>
								)}
							</Fragment>
						</div>
						{this.inputStyleType === EDateTimeInputTypeStyle.MergedLeft && <div class="input-separator"></div>}
					</div>
					<kv-form-help-text helpText={this.helpText} state={this.state} />
				</div>
			</Host>
		);
	}
}

import { Component, Element, Event, EventEmitter, Fragment, Host, Prop, State, Watch, h } from '@stencil/core';
import { EInputFieldType, EValidationState } from '../text-field/text-field.types';
import { EComponentSize } from '../../types';
import { isNil } from 'lodash';
import { DATE_TIME_INPUTMASK_CONFIG } from './date-time-input.config';
import { IDateTimeInput, IDateTimeInputEvents } from './date-time-input.types';
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
	@Prop({ reflect: true }) placeholder?: string = '';
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

	@State() focused = false;

	private nativeInput?: HTMLInputElement;

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() dateTimeBlur: EventEmitter<string>;
	/** @inheritdoc */
	@Event() inputFocus: EventEmitter<FocusEvent>;

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

	private createInputMaskInstance = () => {
		Inputmask(DATE_TIME_INPUTMASK_CONFIG).mask(this.nativeInput);
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
							'input-container': true,
							[`input-container--size-${this.size}`]: true
						}}
					>
						<Fragment>
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
								class={{
									'forced-focus': (this.focused || this.highlighted) && !this.disabled,
									'invalid': this.state === EValidationState.Invalid
								}}
							/>
						</Fragment>
					</div>
					<kv-form-help-text helpText={this.helpText} state={this.state} />
				</div>
			</Host>
		);
	}
}

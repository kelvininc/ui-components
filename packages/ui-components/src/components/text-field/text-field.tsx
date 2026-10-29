import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty, isNil, merge } from 'lodash-es';
import { EComponentSize } from '../../utils/types';
import { EInputFieldType, EValidationState, ITextFieldEvents, ITextField } from './text-field.types';
import { EIconName } from '../icon/icon.types';
import { DEFAULT_TEXT_TOOLTIP_CONFIG, SCROLL_ON_HOVER_DELAY_IN_MS, SCROLL_ON_HOVER_SPEED_IN_PX_PER_S } from './text-field.config';
import { ITooltip } from '../tooltip/tooltip.types';
import { getValueAsString } from './text-field.utils';
import { getUTF8StringLength, isValidLabel } from '../../utils/string.helper';
import { HostAttributes, Method } from '@stencil/core/internal';
import { setAccessibleDescriptionElements } from '../../utils/accessible-description.helper';

/**
 * @part input-container - container that includes the input, right and left slot
 * @part badge - badge rendered at the right of the text field
 */
@Component({
	tag: 'kv-text-field',
	styleUrl: 'text-field.scss',
	shadow: { delegatesFocus: true }
})
export class KvTextField implements ITextField, ITextFieldEvents {
	private nativeInput?: HTMLInputElement;
	private hoverScrollDelay?: ReturnType<typeof setTimeout>;
	private hoverScrollFrame?: number;

	@Element() el!: HTMLKvTextFieldElement;
	/** @inheritdoc */
	@Prop({ reflect: true }) type: EInputFieldType = EInputFieldType.Text;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop() accessibleLabel?: string;
	/** @inheritdoc */
	@Prop() accessibleDescriptionElements?: readonly Element[];
	/** @inheritdoc */
	@Prop({ reflect: true }) examples?: string[];
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) actionIcon?: EIconName;
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
	@Prop({ reflect: false }) inputDisabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputRequired: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: false }) inputReadonly: boolean = false;
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
	@Prop({ reflect: true }) prefixWhenEmpty: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) scrollOnHover: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) caretAtEndOnFocus: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) badge?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) isDirty?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) fitContent?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) customStyle?: HostAttributes['style'];
	/** @inheritdoc */
	@Prop({ reflect: true }) hideBadge?: boolean = false;

	/**
	 * Focuses the input.
	 * @param canFocus Optional live check; returning false cancels focus after queued invocation.
	 */
	@Method()
	async focusInput(canFocus?: () => boolean) {
		if (canFocus?.() !== false) this.nativeInput?.focus();
	}

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
			 * Used for patterns such as input trimming (removing whitespace).
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

	componentWillLoad() {
		// Init the states because Watches run only on component updates
		this._helpTexts = this.buildHelpTextMessages(this.helpText);
		this.focused = this.forcedFocus;
	}

	componentDidLoad() {
		this.updateAndEmitValue(this.getValue());
		if (!this.focused) {
			this.el.blur();
			this.nativeInput?.blur();
		} else {
			this.el.focus();
			this.nativeInput?.focus();
		}
	}

	componentDidRender() {
		setAccessibleDescriptionElements(this.nativeInput, this.accessibleDescriptionElements);
	}

	/** Text field focus state */
	@State() focused = false;

	@Watch('focused')
	focusedChangeHandler(focused: boolean) {
		if (!focused && this.scrollOnHover) {
			this.stopHoverScroll(true);
		}
	}

	@Watch('scrollOnHover')
	scrollOnHoverChangeHandler(scrollOnHover: boolean) {
		if (!scrollOnHover) {
			this.stopHoverScroll(!this.focused);
		}
	}

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() textFieldBlur: EventEmitter<string>;
	/** @inheritdoc */
	@Event() textFieldFocus: EventEmitter<string>;
	/** @inheritdoc */
	@Event() rightActionClick: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() fieldClick: EventEmitter<MouseEvent>;

	private onHostClick = (event: MouseEvent) => {
		if (this.inputDisabled) return;
		event.preventDefault();
		this.fieldClick.emit(event);
	};

	private onRightActionClick = (event: MouseEvent) => {
		event.preventDefault();
		this.rightActionClick.emit(event);
	};

	private onInputHandler = ({ target }: InputEvent) => {
		const input = target as HTMLInputElement | null;

		if (this.maxLength && getUTF8StringLength(input.value) > this.maxLength) {
			// Number inputs have no text selection: `selectionStart` is null and setting a range throws
			const caretPosition = input.selectionStart;
			input.value = this.getValue().substring(0, this.maxLength);
			if (caretPosition !== null) {
				input.setSelectionRange(caretPosition - 1, caretPosition - 1);
			}
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
		this.textFieldFocus.emit((this.nativeInput as HTMLInputElement).value);

		this.focused = true;
		this.stopHoverScroll(false);

		if (this.caretAtEndOnFocus) {
			// After the browser has placed the caret where the pointer landed
			setTimeout(() => this.moveCaretToEnd());
		}
	};

	private moveCaretToEnd() {
		const input = this.nativeInput;

		if (!input || !this.focused) return;

		const end = input.value.length;

		try {
			input.setSelectionRange(end, end);
		} catch {
			// Number, date and similar inputs have no text selection
		}

		input.scrollLeft = input.scrollWidth;
	}

	private onContainerMouseEnter = () => {
		const input = this.nativeInput;

		if (!this.scrollOnHover || this.focused || !input) return;
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

		clearTimeout(this.hoverScrollDelay);
		this.hoverScrollDelay = setTimeout(() => {
			const distance = input.scrollWidth - input.clientWidth;

			if (distance <= 0) return;

			// The ellipsis would hide the very text the scroll brings into view
			input.classList.add('hover-scrolling');

			// Linear, at a reading pace: a longer value takes longer, never faster
			const duration = (distance / SCROLL_ON_HOVER_SPEED_IN_PX_PER_S) * 1000;
			const startedAt = performance.now();
			const step = (now: number) => {
				const progress = Math.min((now - startedAt) / duration, 1);
				input.scrollLeft = distance * progress;

				if (progress < 1) {
					this.hoverScrollFrame = requestAnimationFrame(step);
				}
			};

			this.hoverScrollFrame = requestAnimationFrame(step);
		}, SCROLL_ON_HOVER_DELAY_IN_MS);
	};

	private onContainerMouseLeave = () => {
		if (!this.scrollOnHover) return;

		this.stopHoverScroll(!this.focused);
	};

	/** Stops a hover scroll; `rewind` puts the value back at its start. */
	private stopHoverScroll(rewind: boolean) {
		clearTimeout(this.hoverScrollDelay);

		if (this.hoverScrollFrame !== undefined) {
			cancelAnimationFrame(this.hoverScrollFrame);
			this.hoverScrollFrame = undefined;
		}

		if (rewind && this.nativeInput) {
			this.nativeInput.scrollLeft = 0;
		}

		this.nativeInput?.classList.remove('hover-scrolling');
	}

	disconnectedCallback() {
		this.stopHoverScroll(false);
	}

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

	private getTooltipConfig = (): Partial<ITooltip> => {
		return merge({}, DEFAULT_TEXT_TOOLTIP_CONFIG, this.tooltipConfig ?? {});
	};

	private getAccessibleName(): string | undefined {
		if (isValidLabel(this.label)) return this.label;

		return this.accessibleLabel ?? (isEmpty(this.valuePrefix) ? undefined : this.valuePrefix);
	}

	private hasVisiblePrefix = (value: string): boolean => !isEmpty(this.valuePrefix) && (!isEmpty(value) || this.prefixWhenEmpty);

	render() {
		const id = this.el.getAttribute('id');
		const value = this.getValue();
		const showPrefix = this.hasVisiblePrefix(value);

		return (
			<Host onClick={this.onHostClick} style={{ ...this.customStyle }}>
				<kv-tooltip {...this.getTooltipConfig()}>
					<div class="text-field-container">
						{this.label && <kv-form-label label={this.label} required={this.inputRequired}></kv-form-label>}
						{!this.loading ? (
							<div
								part="input-container"
								onMouseEnter={this.onContainerMouseEnter}
								onMouseLeave={this.onContainerMouseLeave}
								class={{
									'input-container': true,
									[`input-container--size-${this.size}`]: true,
									'invalid': this.state === EValidationState.Invalid,
									'focused': this.focused,
									'disabled': this.inputDisabled,
									'filled': !isEmpty(value)
								}}
							>
								<div
									class={{
										'left-slot-container': true,
										'focus': this.focused,
										'invalid': this.state === EValidationState.Invalid,
										'disabled': this.inputDisabled,
										'filled': !isEmpty(value),
										'has-value-prefix': showPrefix
									}}
								>
									<slot name="left-slot" />
									{this.icon && (
										<kv-icon
											name={this.icon}
											exportparts="icon"
											class={{
												disabled: this.inputDisabled,
												focus: this.focused,
												filled: !isEmpty(value)
											}}
										/>
									)}
									{showPrefix && (
										// A prefix cut to its share of the field shows in full on hover, and only then
										<kv-tooltip
											class="value-prefix-tooltip"
											text={this.valuePrefix}
											position={DEFAULT_TEXT_TOOLTIP_CONFIG.position}
											truncate
											// The prefix has its own tooltip: hovering it is no reason for the field's to open
											onMouseOver={(event: MouseEvent) => event.stopPropagation()}
										>
											<div class="value-prefix">{this.valuePrefix}</div>
										</kv-tooltip>
									)}
								</div>
								<div class="resize-container">
									{this.fitContent && (
										<span class="resize-text" part="input-text">
											{value || this.placeholder}
										</span>
									)}
									<slot name="input">
										<input
											ref={input => (this.nativeInput = input as HTMLInputElement)}
											type={this.type}
											list={!isNil(this.examples) ? `examples_${id}` : undefined}
											name={this.inputName}
											aria-label={this.getAccessibleName()}
											placeholder={this.placeholder}
											disabled={this.inputDisabled}
											max={this.max}
											min={this.min}
											minLength={this.minLength}
											step={this.step}
											value={value}
											onInput={this.onInputHandler}
											onBlur={this.onBlurHandler}
											onFocus={this.onFocusHandler}
											onPaste={this.onPasteHandler}
											class={{ 'resize-input': true, 'forced-focus': this.focused }}
											readonly={this.inputReadonly}
											part="input-text"
										/>
									</slot>
								</div>
								<div
									class={{
										'right-slot-container': true,
										'focus': this.focused,
										'disabled': this.inputDisabled,
										'filled': !isEmpty(value)
									}}
								>
									<slot name="right-slot" />
									{this.isDirty && <kv-dirty-dot />}
									{!this.hideBadge && this.badge?.trim() && <kv-badge exportparts="badge">{this.badge}</kv-badge>}
									{this.actionIcon && (
										<kv-icon
											name={this.actionIcon}
											onClick={this.onRightActionClick}
											class={{
												disabled: this.inputDisabled,
												focus: this.focused,
												filled: !isEmpty(value)
											}}
										/>
									)}
								</div>
							</div>
						) : (
							<div class={{ 'input-container-loading': true, [`input-container-loading--size-${this.size}`]: true }} />
						)}
						{!isEmpty(this._helpTexts) && <kv-form-help-text helpText={this._helpTexts} state={this.state}></kv-form-help-text>}
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

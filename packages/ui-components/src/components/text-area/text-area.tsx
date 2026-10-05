import { Component, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';
import { ITextArea, ITextAreaEvents } from './types';
import { EIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { getUTF8StringLength } from '../../utils/string.helper';

@Component({
	tag: 'kv-text-area',
	styleUrl: 'text-area.scss',
	shadow: true
})
export class KvTextArea implements ITextArea, ITextAreaEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) text?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxCharLength?: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) counter?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) counterAlwaysVisible?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop() accessibleLabel?: string;

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;

	@Listen('keydown', {
		passive: true
	})
	handleKeyDown(ev: KeyboardEvent) {
		if (ev.code === 'Escape') {
			this.blurTextArea();
		}
	}

	private inputRef: HTMLDivElement;

	@State() curCharLength = getUTF8StringLength(this.text);
	@State() showPlaceholder = !this.text ? true : false;

	private syncTextValues(text?: string) {
		if (text != null) {
			this.inputRef.innerText = text;
		}

		const textValue = this.inputRef.innerText;
		this.showPlaceholder = textValue.length === 0 ? true : false;
		this.curCharLength = getUTF8StringLength(textValue);
	}

	private getTextLength = () => {
		return getUTF8StringLength(this.inputRef.innerText);
	};

	private onInput = () => {
		this.syncTextValues();
		this.textChange.emit(this.inputRef.innerText);
	};

	private onKeyPress = (event: KeyboardEvent) => {
		const textLength = this.getTextLength();
		if (this.maxCharLength && this.maxCharLength <= textLength) {
			event.preventDefault();
		}
	};

	private onClipboardPaste = (event: ClipboardEvent) => {
		const textLength = this.getTextLength();
		const pasteData = event.clipboardData.getData('text/plain');
		// A missing or zero limit allows the native paste.
		const exceedsLimit = this.maxCharLength > 0 && textLength + getUTF8StringLength(pasteData) > this.maxCharLength;

		if (exceedsLimit) {
			event.preventDefault();
			return;
		}
	};

	private focusTextArea = () => {
		this.inputRef.focus();
	};

	private blurTextArea = () => {
		this.inputRef.blur();
	};

	private updateInputRef = (ref: HTMLDivElement) => {
		this.inputRef = ref;
		this.syncTextValues(this.text);
	};

	render() {
		return (
			<Host>
				<div class={{ 'text-area-container': true, 'disabled': this.disabled, 'counter-always-visible': this.counterAlwaysVisible }}>
					{this.icon && <kv-icon name={this.icon} />}
					<div class="text-area" onClick={this.focusTextArea}>
						<div
							class={{
								'text-area-wrapper': true,
								'has-text': this.inputRef?.innerText.length > 0,
								'invalid': this.state === EValidationState.Invalid
							}}
						>
							<div
								class={{
									input: true,
									placeholder: this.showPlaceholder
								}}
								data-placeholder={this.placeholder}
								role="textbox"
								aria-label={this.accessibleLabel}
								aria-multiline="true"
								aria-placeholder={this.placeholder}
								aria-invalid={this.state === EValidationState.Invalid ? 'true' : undefined}
								aria-disabled={this.disabled ? 'true' : undefined}
								ref={this.updateInputRef}
								onPaste={this.onClipboardPaste}
								onKeyPress={this.onKeyPress}
								onInput={this.onInput}
								contentEditable={this.disabled ? 'false' : 'plaintext-only'}
							/>
						</div>
						{this.counter && this.maxCharLength && (
							<div class="character-counter">
								Max. character: {this.curCharLength}/{this.maxCharLength}
							</div>
						)}
					</div>
				</div>
			</Host>
		);
	}
}

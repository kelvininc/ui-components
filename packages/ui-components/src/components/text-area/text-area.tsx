import { Component, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';
import { ITextArea, ITextAreaEvents } from './types';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { getUTF8StringLength } from '../../utils/string.helper';

@Component({
	tag: 'kv-text-area',
	styleUrl: 'text-area.scss',
	shadow: true
})
export class KvTextArea implements ITextArea, ITextAreaEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) text?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxCharLength?: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) counter?: boolean = true;

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

	syncTextValues(text?: string) {
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
		const shouldPaste = this.maxCharLength && textLength + getUTF8StringLength(pasteData) <= this.maxCharLength;

		if (!shouldPaste) {
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
				<div class="text-area-container">
					{this.icon && <kv-icon name={this.icon} customClass="icon-20" class="left-icon" />}
					<div class="text-area" onClick={this.focusTextArea}>
						<div
							class={{
								'text-area-wrapper': true,
								'has-text': this.inputRef?.innerText.length > 0
							}}
						>
							<div
								class={{
									input: true,
									placeholder: this.showPlaceholder
								}}
								data-placeholder={this.placeholder}
								ref={this.updateInputRef}
								onPaste={this.onClipboardPaste}
								onKeyPress={this.onKeyPress}
								onInput={this.onInput}
								contentEditable
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

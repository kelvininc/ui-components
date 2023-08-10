import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
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
	@Prop({ reflect: true }) maxCharLength!: number;

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() textChangeBlur: EventEmitter<string>;

	private inputRef: HTMLDivElement;

	@State() curCharLength = getUTF8StringLength(this.text);
	@State() isEditing = this.text?.length > 0;
	@State() showPlaceholder = !this.text ? true : false;

	syncTextValues(text?: string) {
		if (text != null) {
			this.inputRef.innerText = text;
		}

		const textValue = this.inputRef.innerText;
		this.showPlaceholder = textValue.length === 0 ? true : false;
		this.curCharLength = getUTF8StringLength(textValue);
	}

	private onInput = () => {
		this.syncTextValues();
		this.textChange.emit(this.inputRef.innerText);
	};

	private onKeyPress = (event: KeyboardEvent) => {
		if (getUTF8StringLength(this.inputRef.innerText) >= this.maxCharLength) {
			event.preventDefault();
		}
	};

	private onClipboardPaste = (event: ClipboardEvent) => {
		const textLength = getUTF8StringLength(this.inputRef.innerText);
		const pasteData = event.clipboardData.getData('text/plain');
		const shouldPaste = textLength + getUTF8StringLength(pasteData) <= this.maxCharLength;

		event.preventDefault();

		if (!shouldPaste) {
			return;
		}

		document.execCommand('inserttext', false, pasteData);
	};

	private onTextAreaClick = () => {
		this.isEditing = true;
		this.inputRef.focus();
	};

	private onTextAreaLeave = () => {
		this.textChangeBlur.emit(this.inputRef.innerText);
	};

	private onToggleTextArea = () => {
		this.isEditing = !this.isEditing;
	};

	private updateInputRef = (ref: HTMLDivElement) => {
		this.inputRef = ref;
		this.syncTextValues(this.text);
	};

	render() {
		return (
			<Host>
				<div class="text-area-container">
					{this.icon && <kv-icon name={this.icon} customClass={'icon-20'} class="left-icon" onClick={this.onToggleTextArea} />}
					<div class="text-area" onClick={this.onTextAreaClick} onFocusout={this.onTextAreaLeave}>
						<div
							class={{
								'text-area-wrapper': true,
								'editing': this.isEditing,
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
						<div class="character-counter">
							Max. character: {this.curCharLength}/{this.maxCharLength}
						</div>
					</div>
				</div>
			</Host>
		);
	}
}

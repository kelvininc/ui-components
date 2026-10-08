import { Component, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { ITextArea, ITextAreaEvents } from './types';
import { EIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { getUTF8StringLength } from '../../utils/string.helper';
import { setAccessibleDescriptionElements } from '../../utils/accessible-description.helper';

// Stencil's bundled DOM types predate composed selection ranges.
type ComposedSelection = Selection & {
	getComposedRanges?: (options: { shadowRoots: ShadowRoot[] }) => StaticRange[];
};

@Component({
	tag: 'kv-text-area',
	styleUrl: 'text-area.scss',
	shadow: { delegatesFocus: true }
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
	@Prop() accessibleDescriptionElements?: readonly Element[];

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

	@Listen('compositionstart')
	handleCompositionStart() {
		this.composing = true;
	}

	@Listen('compositionend')
	handleCompositionEnd() {
		this.composing = false;
		this.onInput();
	}

	@Listen('beforeinput', { passive: false })
	handleBeforeInput(event: InputEvent) {
		if (this.composing || event.isComposing || !event.cancelable || !(this.maxCharLength > 0)) return;
		const insertedText = event.inputType === 'insertText' ? event.data : ['insertParagraph', 'insertLineBreak'].includes(event.inputType) ? '\n' : null;
		if (insertedText != null && this.getTextLengthAfterSelection() + getUTF8StringLength(insertedText) > this.maxCharLength) event.preventDefault();
	}

	private inputRef: HTMLDivElement;
	private committedText = '';
	private composing = false;

	@State() curCharLength = getUTF8StringLength(this.text);
	@State() showPlaceholder = !this.text ? true : false;

	@Watch('text')
	onTextChanged(text?: string) {
		const nextText = text ?? '';
		// Controlled echoes must keep the user's caret where it is.
		if (this.inputRef && this.inputRef.innerText !== nextText) {
			this.syncTextValues(nextText);
		}
	}

	private syncTextValues(text?: string) {
		if (text != null) {
			this.inputRef.textContent = text;
		}

		const textValue = this.inputRef.innerText;
		this.committedText = textValue;
		this.showPlaceholder = textValue.length === 0 ? true : false;
		this.curCharLength = getUTF8StringLength(textValue);
	}

	private getTextLengthAfterSelection = () => {
		const selection = this.inputRef.ownerDocument.getSelection?.() as ComposedSelection | null;
		// Composed ranges expose endpoints inside this control's shadow root.
		const range = selection?.getComposedRanges?.({ shadowRoots: [this.inputRef.getRootNode() as ShadowRoot] })?.[0];
		const start = range?.startContainer ?? selection?.anchorNode;
		const end = range?.endContainer ?? selection?.focusNode;
		const selectedText = selection && this.inputRef.contains(start) && this.inputRef.contains(end) ? selection.toString() : '';
		return getUTF8StringLength(this.inputRef.innerText) - getUTF8StringLength(selectedText);
	};

	private onInput = (event?: InputEvent) => {
		// Let the browser finish its IME draft before committing or restoring text.
		if (this.composing || event?.isComposing) return;
		// Chromium leaves a sole BR as the editing placeholder after clearing.
		if (this.inputRef.childNodes.length === 1 && this.inputRef.firstChild.nodeName === 'BR') {
			this.inputRef.innerText = '';
		}
		const textValue = this.inputRef.innerText;
		const changed = textValue !== this.committedText;
		const exceedsLimit = this.maxCharLength > 0 && getUTF8StringLength(textValue) > this.maxCharLength;
		if (changed && exceedsLimit && !event?.inputType?.startsWith('delete')) {
			this.syncTextValues(this.committedText);
			this.inputRef.ownerDocument.getSelection?.()?.collapse(this.inputRef, this.inputRef.childNodes.length);
			return;
		}
		this.syncTextValues();
		if (changed) this.textChange.emit(textValue);
	};

	private onKeyPress = (event: KeyboardEvent) => {
		if (this.composing || event.isComposing) return;
		const textLength = this.getTextLengthAfterSelection();
		const insertedLength = getUTF8StringLength(event.key === 'Enter' ? '\n' : event.key);
		if (this.maxCharLength && textLength + insertedLength > this.maxCharLength) {
			event.preventDefault();
		}
	};

	private onClipboardPaste = (event: ClipboardEvent) => {
		const textLength = this.getTextLengthAfterSelection();
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

	componentDidRender() {
		setAccessibleDescriptionElements(this.inputRef, this.accessibleDescriptionElements);
	}

	render() {
		return (
			<Host>
				<div class={{ 'text-area-container': true, 'disabled': this.disabled, 'counter-always-visible': this.counterAlwaysVisible }}>
					{this.icon && <kv-icon name={this.icon} />}
					<div class="text-area" onClick={this.focusTextArea}>
						<div
							class={{
								'text-area-wrapper': true,
								'has-text': !this.showPlaceholder,
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
							{this.counter && this.maxCharLength ? (
								<div class="character-counter">
									{this.curCharLength} / {this.maxCharLength}
								</div>
							) : null}
						</div>
					</div>
				</div>
			</Host>
		);
	}
}

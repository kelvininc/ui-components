import { Component, Host, Element, h, Event, State, Fragment, Listen, EventEmitter, Method, Prop } from '@stencil/core';
import { EActionButtonType } from '../action-button/action-button.types';
import { EIconName } from '../icon/icon.types';
import { DEFAULT_MAX_LENGTH, DELAYED_BLUR_MS } from './inline-editable-field.config';

@Component({
	tag: 'kv-inline-editable-field',
	styleUrl: 'inline-editable-field.scss'
})
export class KvInlineEditableField {
	@Element() el: HTMLKvInlineEditableFieldElement;

	private slotEl: HTMLElement;

	/**
	 * The value of the field.
	 */
	@Prop({ reflect: true }) value: string;
	/**
	 * Indicates whether the editable field is disabled.
	 */
	@Prop({ reflect: true }) disabled: boolean;
	/**
	 * The maximum length of the editable field.
	 */
	@Prop({ reflect: true }) maxLength: number = DEFAULT_MAX_LENGTH;

	/**
	 * Emitted when the content is edited.
	 */
	@Event() contentEdited: EventEmitter<string>;
	/**
	 * Emitted when the content is focused.
	 */
	@Event() contentFocused: EventEmitter<void>;
	/**
	 * Emitted when the content is blurred.
	 */
	@Event() contentBlured: EventEmitter<void>;

	/**
	 * Resets the content of the editable field.
	 */
	@Method()
	async resetContent() {
		this.discardContent();
		this.slotEl.blur();
	}

	@State() isHovering: boolean = false;
	@State() isEditing: boolean = false;
	@State() isSaving: boolean = false;
	@State() isSaveDisabled: boolean = false;
	@State() timeoutID: number;

	@Listen('mouseenter')
	handleMouseHover() {
		this.isHovering = true;
	}

	@Listen('mouseleave')
	handleMouseLeave() {
		this.isHovering = false;
	}

	@Listen('keydown', { target: 'document' })
	handleKeyDown(event: KeyboardEvent) {
		if (!this.isEditing || this.disabled) return;

		switch (event.key) {
			case 'Escape':
				this.slotEl.blur();
				break;
			case 'Enter':
				this.saveChanges();
				break;
			case 'Backspace':
				break;
			default:
				this.handleMaxLength(event);
		}
	}

	private discardContent = () => {
		this.slotEl.innerText = this.value;
	};

	private saveChanges = () => {
		this.slotEl.blur();

		const newValue = this.slotEl.innerText;
		if (newValue.length === 0) return;

		if (newValue !== this.value) {
			this.isSaving = true;
			this.contentEdited.emit(newValue);
		}
	};

	private handleBlur = () => {
		this.slotEl.innerText = this.slotEl.innerText.trim();

		this.timeoutID = window.setTimeout(() => {
			// if saving button hasn't clicked, discard content
			if (!this.isSaving) {
				this.discardContent();
			}

			this.isEditing = false;
			this.isSaving = false;
			this.contentBlured.emit();
		}, DELAYED_BLUR_MS);
	};

	public handleFocus = () => {
		clearTimeout(this.timeoutID);

		this.isEditing = true;
		this.contentFocused.emit();
		this.checkSaveBtnDisabled();
	};

	private handleMaxLength = (event: KeyboardEvent) => {
		if (this.maxLength && this.slotEl.innerText.length >= this.maxLength) {
			event.preventDefault();
		}
	};

	private checkSaveBtnDisabled = () => {
		this.isSaveDisabled = this.slotEl.innerText.trim().length === 0;
	};

	private initializeEditableContent() {
		this.slotEl.classList.add('inline-editable-field-slot');
		this.slotEl.setAttribute('contenteditable', 'true');
		this.slotEl.addEventListener('blur', this.handleBlur);
		this.slotEl.addEventListener('focus', this.handleFocus);
		this.slotEl.addEventListener('input', this.checkSaveBtnDisabled);
	}

	connectedCallback() {
		if (this.disabled) {
			return;
		}

		if (this.el.children.length !== 1) {
			throw new Error('Inline editable field must have exactly one child element to be editable');
		}

		this.slotEl = this.el.children[0] as HTMLElement;
		this.initializeEditableContent();
	}

	render() {
		if (this.disabled) {
			return (
				<Host>
					<slot></slot>
				</Host>
			);
		}

		return (
			<Host
				class={{
					'inline-editable-field-container': true,
					'inline-editable-field-container__hover': this.isHovering
				}}
			>
				<slot></slot>
				<div
					class={{
						'inline-editable-field-actions': true,
						'inline-editable-field-actions__focus': this.isEditing
					}}
				>
					{this.isEditing && (
						<Fragment>
							<kv-action-button-icon type={EActionButtonType.Ghost} icon={EIconName.Close} onClickButton={this.discardContent} />
							<kv-action-button-icon type={EActionButtonType.Ghost} icon={EIconName.DoneAll} disabled={this.isSaveDisabled} onClickButton={this.saveChanges} />
						</Fragment>
					)}
				</div>
			</Host>
		);
	}
}

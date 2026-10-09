import { Component, Element, Event, Method, Prop, Watch, h } from '@stencil/core';
import { COMPONENT_STRINGS } from '../../strings';
import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize, ITextField } from '../../types';
import { ISelectCreateOption, ISelectCreateOptionEvents } from './select-create-option.types';
import { isImeComposition } from '../../utils/keyboard-event.helper';
import { isEmpty, isNil } from 'lodash-es';

/**
 * @part create-button - The create action button element.
 * @part cancel-button - The cancel action button element.
 * @part text-field - The text field element.
 */

@Component({
	tag: 'kv-select-create-option',
	styleUrl: 'select-create-option.scss',
	shadow: false
})
export class KvSelectCreateOption implements ISelectCreateOption, ISelectCreateOptionEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) value?: string = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size?: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};

	/** @inheritdoc */
	@Event() clickCreate: EventEmitter<MouseEvent | KeyboardEvent>;
	/** @inheritdoc */
	@Event() clickCancel: EventEmitter<MouseEvent | KeyboardEvent>;
	/** @inheritdoc */
	@Event() valueChanged: EventEmitter<string>;

	@Element() el: HTMLKvSelectCreateOptionElement;

	/** Focus the input */
	@Method()
	async focusInput() {
		await this.input?.focusInput();
	}

	/** Blur the input */
	@Method()
	async blurInput() {
		const activeElement = this.input?.shadowRoot?.activeElement;

		if (activeElement instanceof HTMLElement) {
			activeElement.blur();
		}
	}

	@Watch('loading')
	loadingChangeHandler(loading: boolean, wasLoading: boolean) {
		if (!wasLoading || loading) {
			return;
		}

		// A submit that did not go through hands the form back, so the caret returns to the field a click
		// on the create button took it from; but not from wherever the user has moved on to meanwhile
		const formActiveElement = (this.el.getRootNode() as Document | ShadowRoot).activeElement;
		const isFocusLost = isNil(document.activeElement) || document.activeElement === document.body;

		if (isFocusLost || (!isNil(formActiveElement) && this.el.contains(formActiveElement))) {
			this.focusInput();
		}
	}

	private input?: HTMLKvTextFieldElement;

	private onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' && event.key !== 'Escape') {
			return;
		}

		// Both keys stay inside the form, even while they compose a character: document listeners, such as
		// a wizard's Enter or a modal's Escape, must not also act on them
		event.stopPropagation();

		// A key composing a character belongs to the input method, which keeps its default behaviour
		if (isImeComposition(event)) {
			return;
		}

		if (event.key === 'Escape') {
			this.onCancel(event);
			return;
		}

		// Only from the field: a focused button is not a submit, and a held key does not repeat it
		if (event.target === this.input && !event.repeat) {
			event.preventDefault();
			this.onCreate(event);
		}
	};

	private onCreate = (event: MouseEvent | KeyboardEvent) => {
		if (!this.canSubmit) {
			return;
		}

		this.clickCreate.emit(event);
	};

	private onCancel = (event: MouseEvent | KeyboardEvent) => {
		if (this.loading) {
			return;
		}

		this.clickCancel.emit(event);
	};

	private get canSubmit() {
		return !isEmpty(this.value) && !this.disabled && !this.loading;
	}

	componentDidLoad() {
		this.input?.focusInput();
	}

	render() {
		return (
			<div class="select-create-option" onKeyDown={this.onKeyDown}>
				<div class="form">
					<kv-text-field
						ref={element => (this.input = element)}
						inputDisabled={this.disabled}
						size={this.size}
						value={this.value}
						{...this.inputConfig}
						// Read-only rather than disabled while submitting, so the field keeps its focus; set
						// after the config so that no config can unlock it
						inputReadonly={this.loading || !!this.inputConfig?.inputReadonly}
						onTextChange={({ detail: newValue }) => this.valueChanged.emit(newValue)}
						part="text-field"
					/>
				</div>
				<div class="actions">
					<kv-action-button-icon
						type={EActionButtonType.Secondary}
						icon={EIconName.Close}
						accessibleLabel={COMPONENT_STRINGS.cancel}
						size={this.size}
						disabled={this.loading}
						onClickButton={({ detail: event }) => this.onCancel(event)}
						part="cancel-button"
					/>
					<kv-action-button-icon
						type={EActionButtonType.Secondary}
						icon={EIconName.DoneAll}
						accessibleLabel={COMPONENT_STRINGS.createOption}
						size={this.size}
						disabled={!this.canSubmit}
						loading={this.loading}
						onClickButton={({ detail: event }) => this.onCreate(event)}
						part="create-button"
					/>
				</div>
			</div>
		);
	}
}

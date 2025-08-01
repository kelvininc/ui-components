import { Component, Event, Method, Prop, h } from '@stencil/core';
import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize, ITextField } from '../../types';
import { ISelectCreateOption, ISelectCreateOptionEvents } from './select-create-option.types';
import { isEmpty } from 'lodash-es';

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
	@Prop({ reflect: true }) size?: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};

	/** @inheritdoc */
	@Event() clickCreate: EventEmitter<MouseEvent | KeyboardEvent>;
	/** @inheritdoc */
	@Event() clickCancel: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() valueChanged: EventEmitter<string>;

	/** Focus the input */
	@Method()
	async focusInput() {
		this.input.focus();
	}

	/** Blur the input */
	@Method()
	async blurInput() {
		this.input.blur();
	}

	private input?: HTMLKvTextFieldElement;

	private onKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			this.onCreate(event);
		}
	};

	private onCreate = (event: MouseEvent | KeyboardEvent) => {
		if (!this.canSubmit) {
			return;
		}

		this.clickCreate.emit(event);
	};

	private onCancel = (event: MouseEvent) => {
		this.clickCancel.emit(event);
	};

	private get canSubmit() {
		return !isEmpty(this.value) && !this.disabled;
	}

	componentDidLoad() {
		this.input.focusInput();
	}

	render() {
		return (
			<div class="select-create-option">
				<div class="form">
					<kv-text-field
						ref={element => (this.input = element)}
						inputDisabled={this.disabled}
						size={this.size}
						value={this.value}
						{...this.inputConfig}
						onKeyPress={this.onKeyPress}
						onTextChange={({ detail: newValue }) => this.valueChanged.emit(newValue)}
						part="text-field"
					/>
				</div>
				<div class="actions">
					<kv-action-button-icon
						type={EActionButtonType.Tertiary}
						icon={EIconName.Close}
						size={this.size}
						onClickButton={({ detail: event }) => this.onCancel(event)}
						part="cancel-button"
					/>
					<kv-action-button-icon
						type={EActionButtonType.Primary}
						icon={EIconName.DoneAll}
						size={this.size}
						disabled={!this.canSubmit}
						onClickButton={({ detail: event }) => this.onCreate(event)}
						part="create-button"
					/>
				</div>
			</div>
		);
	}
}

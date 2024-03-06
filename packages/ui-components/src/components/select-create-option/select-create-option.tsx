import { Component, Event, Method, Prop, State, h } from '@stencil/core';
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
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size?: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};

	/** @inheritdoc */
	@Event() create: EventEmitter<string>;
	/** @inheritdoc */
	@Event() cancel: EventEmitter<void>;
	/** @inheritdoc */
	@Event() valueChanged: EventEmitter<string>;

	@State() value: string = '';

	/** Focuses the input */
	@Method()
	async focusInput() {
		this.input.focus();
	}

	private input?: HTMLKvTextFieldElement;

	private onKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			this.onCreate();
		}
	};

	private onChangeValue = (newValue: string) => {
		this.value = newValue;
		this.valueChanged.emit(newValue);
	};

	private onCreate = () => {
		if (!this.canSubmit) {
			return;
		}

		this.create.emit(this.value);
		this.value = '';
	};

	private onCancel = () => {
		this.cancel.emit();
		this.value = '';
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
						disabled={this.disabled}
						size={this.size}
						value={this.value}
						{...this.inputConfig}
						onKeyPress={this.onKeyPress}
						onTextChange={({ detail: newValue }) => this.onChangeValue(newValue)}
						part="text-field"
					/>
				</div>
				<div class="actions">
					<kv-action-button-icon type={EActionButtonType.Tertiary} icon={EIconName.Close} size={this.size} onClickButton={this.onCancel} part="cancel-button" />
					<kv-action-button-icon
						type={EActionButtonType.Primary}
						icon={EIconName.DoneAll}
						size={this.size}
						disabled={!this.canSubmit}
						onClickButton={this.onCreate}
						part="create-button"
					/>
				</div>
			</div>
		);
	}
}

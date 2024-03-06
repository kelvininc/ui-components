import { Component, Event, Prop, State, h } from '@stencil/core';
import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize, EInputFieldType, EValidationState } from '../../types';
import { ISelectCreateOption, ISelectCreateOptionEvents } from './select-create-option.types';
import { DEFAULT_PLACEHOLDER } from './select-create-option.config';

@Component({
	tag: 'kv-select-create-option',
	styleUrl: 'select-create-option.scss',
	shadow: false
})
export class KvSelectCreateOption implements ISelectCreateOption, ISelectCreateOptionEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string = DEFAULT_PLACEHOLDER;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText: string | string[] = [];

	/** @inheritdoc */
	@Event() create: EventEmitter<string>;
	/** @inheritdoc */
	@Event() cancel: EventEmitter<void>;
	/** @inheritdoc */
	@Event() valueChanged: EventEmitter<string>;

	@State() value: string = '';

	private input?: HTMLKvTextFieldElement;

	private onKeyPress = (event: KeyboardEvent) => {
		if (event.code === 'Enter') {
			this.create.emit(this.value);
		}
	};

	private onChangeValue = (newValue: string) => {
		this.value = newValue;
		this.valueChanged.emit(newValue);
	};

	private onCreate = () => {
		this.value = '';
		this.create.emit(this.value);
	};

	componentDidLoad() {
		this.input.focusInput();
	}

	render() {
		return (
			<div class="select-create-option">
				<div class="form">
					<kv-text-field
						ref={element => (this.input = element)}
						type={EInputFieldType.Text}
						size={EComponentSize.Small}
						value={this.value}
						onKeyPress={this.onKeyPress}
						onTextChange={({ detail: newValue }) => this.onChangeValue(newValue)}
						placeholder={this.placeholder}
						state={this.state}
						helpText={this.helpText}
						disabled={this.disabled}
					/>
				</div>
				<div class="actions">
					<kv-action-button-icon type={EActionButtonType.Tertiary} icon={EIconName.Close} size={EComponentSize.Small} onClickButton={() => this.cancel.emit()} />
					<kv-action-button-icon
						type={EActionButtonType.Primary}
						icon={EIconName.DoneAll}
						size={EComponentSize.Small}
						disabled={!this.value || this.state === EValidationState.Invalid || this.disabled}
						onClickButton={this.onCreate}
					/>
				</div>
			</div>
		);
	}
}

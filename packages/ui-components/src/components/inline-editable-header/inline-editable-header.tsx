import { Component, Host, Prop, Event, h, EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize, EInputFieldType, EValidationState, ITooltip } from '../../types';
import { IInlineEditableHeader, IInlineEditableHeaderEvents } from './inline-editable-header.types';

@Component({
	tag: 'kv-inline-editable-header',
	styleUrl: 'inline-editable-header.scss',
	shadow: true
})
export class KvInlineEditableHeader implements IInlineEditableHeader, IInlineEditableHeaderEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) type?: EInputFieldType;
	/** @inheritdoc */
	@Prop({ reflect: true }) label: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputName?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) examples?: string[];
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string;
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
	@Prop({ reflect: true }) size: EComponentSize;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) required?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) state?: EValidationState;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText?: string | string[];
	/** @inheritdoc */
	@Prop({ reflect: true }) value?: string | number | null = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) readonly?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) forcedFocus?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) tooltipConfig?: Partial<ITooltip>;
	/** @inheritdoc */
	@Prop({ reflect: true }) useInputMask?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputMaskRegex?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) isEditing: boolean = false;

	/** @inheritdoc */
	@Event() changeConfirmed: EventEmitter<void>;
	/** @inheritdoc */
	@Event() changeDiscarded: EventEmitter<void>;
	/** @inheritdoc */
	@Event() textFieldChange: EventEmitter<string | number>;
	/** @inheritdoc */
	@Event() textFieldBlur: EventEmitter<string | number>;
	/** @inheritdoc */
	@Event() doubleClick: EventEmitter<void>;

	private onConfirm = () => {
		this.changeConfirmed.emit();
	};

	private onCancel = () => {
		this.changeDiscarded.emit();
	};

	private onDoubleClick = () => {
		this.doubleClick.emit();
	};

	private onTextBlur = ({ detail }: CustomEvent<string>) => {
		this.textFieldBlur.emit(detail);
	};

	private onTextChange = ({ detail }: CustomEvent<string>) => {
		this.textFieldChange.emit(detail);
	};

	render() {
		return (
			<Host>
				<div class="inline-editable-header">
					{!this.readonly && this.isEditing ? (
						<div class="edit-mode-wrapper">
							<kv-text-field
								type={this.type}
								label={this.label}
								icon={this.icon}
								inputName={this.inputName}
								examples={this.examples}
								placeholder={this.placeholder}
								maxLength={this.maxLength}
								minLength={this.minLength}
								max={this.max}
								min={this.min}
								step={this.step}
								size={this.size}
								disabled={this.disabled}
								required={this.required}
								loading={this.loading}
								state={this.state}
								helpText={this.helpText}
								value={this.value}
								tooltipConfig={this.tooltipConfig}
								useInputMask={this.useInputMask}
								inputMaskRegex={this.inputMaskRegex}
								onTextFieldBlur={this.onTextBlur}
								onTextChange={this.onTextChange}
							></kv-text-field>
							<kv-action-button-icon
								icon={EIconName.DoneAll}
								type={EActionButtonType.Tertiary}
								size={EComponentSize.Large}
								onClickButton={this.onConfirm}
							></kv-action-button-icon>
							<kv-action-button-icon
								icon={EIconName.Close}
								type={EActionButtonType.Tertiary}
								size={EComponentSize.Large}
								onClickButton={this.onCancel}
							></kv-action-button-icon>
						</div>
					) : (
						<div
							class={{
								'label': true,
								'read-only': this.readonly
							}}
							onDblClick={this.onDoubleClick}
						>
							{this.value}
						</div>
					)}
				</div>
			</Host>
		);
	}
}

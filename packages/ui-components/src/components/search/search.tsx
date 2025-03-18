import { Component, h, Event, EventEmitter, Prop, Host, Method } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EComponentSize, ITooltip } from '../../types';
import { EIconName } from '../icon/icon.types';
import { EInputFieldType, EValidationState } from '../text-field/text-field.types';
import { ISearch, ISearchEvents } from './search.types';

@Component({
	tag: 'kv-search',
	shadow: true
})
export class KvSearch implements ISearch, ISearchEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) type: EInputFieldType = EInputFieldType.Text;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) examples?: string[];
	/** @inheritdoc */
	@Prop({ reflect: true }) inputName?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string = 'Search';
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
	@Prop() size: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputDisabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputRequired: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputReadonly: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) forcedFocus: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) tooltipConfig?: Partial<ITooltip>;
	/** @inheritdoc */
	@Prop({ reflect: true }) value?: string | number | null = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) useInputMask?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputMaskRegex?: string = '';

	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() textFieldBlur: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clickResetButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() rightActionClick: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() fieldClick: EventEmitter<MouseEvent>;

	/** Focus input */
	@Method()
	async focusInput() {
		this.inputRef.focusInput();
	}

	private inputRef?: HTMLKvTextFieldElement | null;

	private onTextChange = (event: CustomEvent<string>) => {
		event.stopPropagation();
		this.textChange.emit(event.detail);
	};

	private onResetClick = (event: CustomEvent<MouseEvent>) => {
		event.stopPropagation();
		this.clickResetButton.emit(event.detail);
		this.textChange.emit();
	};

	render() {
		const shouldShowResetIcon = !isEmpty(this.value) && !this.inputDisabled;
		return (
			<Host>
				<kv-text-field
					ref={el => (this.inputRef = el)}
					actionIcon={shouldShowResetIcon ? EIconName.Close : undefined}
					onTextChange={this.onTextChange}
					onRightActionClick={this.onResetClick}
					type={this.type}
					label={this.label}
					examples={this.examples}
					icon={EIconName.Search}
					inputName={this.inputName}
					placeholder={this.placeholder}
					maxLength={this.maxLength}
					minLength={this.minLength}
					max={this.max}
					min={this.min}
					step={this.step}
					size={this.size}
					inputDisabled={this.inputDisabled}
					inputRequired={this.inputRequired}
					loading={this.loading}
					state={this.state}
					inputReadonly={this.inputReadonly}
					helpText={this.helpText}
					forcedFocus={this.forcedFocus}
					tooltipConfig={this.tooltipConfig}
					value={this.value}
					useInputMask={this.useInputMask}
					inputMaskRegex={this.inputMaskRegex}
					fitContent={false}
				/>
			</Host>
		);
	}
}

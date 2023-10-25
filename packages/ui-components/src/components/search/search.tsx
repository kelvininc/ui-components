import { Component, h, Event, EventEmitter, Prop, Host } from '@stencil/core';
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
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) required: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) readonly: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) forcedFocus: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) forcedInputFocus: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) highlighted: boolean = false;
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
		const shouldShowResetIcon = !isEmpty(this.value) && !this.disabled;
		return (
			<Host>
				<kv-text-field
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
					disabled={this.disabled}
					required={this.required}
					loading={this.loading}
					state={this.state}
					readonly={this.readonly}
					helpText={this.helpText}
					forcedFocus={this.forcedFocus}
					forcedInputFocus={this.forcedInputFocus}
					highlighted={this.highlighted}
					tooltipConfig={this.tooltipConfig}
					value={this.value}
					useInputMask={this.useInputMask}
					inputMaskRegex={this.inputMaskRegex}
				/>
			</Host>
		);
	}
}

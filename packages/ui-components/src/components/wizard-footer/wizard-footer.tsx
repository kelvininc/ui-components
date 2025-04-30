import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { IWizardFooter, IWizardFooterEvents } from './wizard-footer.types';
import { EActionButtonType, ETooltipPosition, IStepBarStep } from '../../types';
import { TOOLTIP_CUSTOM_STYLE } from './wizard-footer.config';

/**
 * @part footer-actions-container - the container of footer stepper and additional actions
 */
@Component({
	tag: 'kv-wizard-footer',
	styleUrl: 'wizard-footer.scss',
	shadow: true
})
export class KvWizardFooter implements IWizardFooter, IWizardFooterEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) steps!: IStepBarStep[];
	/** @inheritdoc */
	@Prop({ reflect: true }) currentStep!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) progressPercentage!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) hasError: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) showStepBar?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) completeBtnLabel: string = 'Submit';
	/** @inheritdoc */
	@Prop({ reflect: true }) cancelEnabled: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) prevEnabled: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) nextEnabled: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) nextTooltip?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) completeEnabled: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) completeTooltip?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) showCancelBtn: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) showPrevBtn: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) showNextBtn: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) showCompleteBtn: boolean;

	/** @inheritdoc */
	@Event() stepClick: EventEmitter<number>;
	/** @inheritdoc */
	@Event() cancelClick: EventEmitter<void>;
	/** @inheritdoc */
	@Event() prevClick: EventEmitter<void>;
	/** @inheritdoc */
	@Event() nextClick: EventEmitter<void>;
	/** @inheritdoc */
	@Event() completeClick: EventEmitter<void>;

	private onPrevClick = () => {
		this.prevClick.emit();
	};

	private onNextClick = () => {
		this.nextClick.emit();
	};

	private onCancelClick = () => {
		this.cancelClick.emit();
	};

	private onCompleteClick = () => {
		this.completeClick.emit();
	};

	private onStepClick = ({ detail }: CustomEvent<number>) => {
		this.stepClick.emit(detail);
	};

	render() {
		return (
			<Host>
				<div class="wizard-footer-container">
					<div class="actions-container" part="footer-actions-container">
						{this.showStepBar && (
							<div class="wizard-stepper">
								<kv-step-bar
									label={this.label}
									steps={this.steps}
									currentStep={this.currentStep}
									progressPercentage={this.progressPercentage}
									hasError={this.hasError}
									onStepClicked={this.onStepClick}
								/>
							</div>
						)}
						<slot name="additional-actions" />
					</div>
					<div class="buttons-container">
						{this.showCancelBtn && (
							<kv-action-button-text type={EActionButtonType.Ghost} text="Cancel" disabled={!this.cancelEnabled} onClickButton={this.onCancelClick} />
						)}
						{this.showPrevBtn && (
							<kv-action-button-text type={EActionButtonType.Tertiary} text="Previous" disabled={!this.prevEnabled} onClickButton={this.onPrevClick} />
						)}
						{this.showNextBtn && (
							<kv-tooltip position={ETooltipPosition.TopEnd} text={this.nextTooltip} customStyle={TOOLTIP_CUSTOM_STYLE}>
								<kv-action-button-text type={EActionButtonType.Primary} text="Next" disabled={!this.nextEnabled} onClickButton={this.onNextClick} />
							</kv-tooltip>
						)}
						{this.showCompleteBtn && (
							<kv-tooltip position={ETooltipPosition.TopEnd} text={this.completeTooltip} customStyle={TOOLTIP_CUSTOM_STYLE}>
								<kv-action-button-text
									type={EActionButtonType.Primary}
									text={this.completeBtnLabel}
									disabled={!this.completeEnabled}
									onClickButton={this.onCompleteClick}
								/>
							</kv-tooltip>
						)}
					</div>
				</div>
			</Host>
		);
	}
}

import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { IWizardFooter, IWizardFooterEvents } from './wizard-footer.types';
import { EActionButtonType, IStepBarStep } from '../../types';
import { isEmpty } from 'lodash';

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
	@Prop({ reflect: true }) prevBtnLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) nextBtnLabel: string = 'Next';
	/** @inheritdoc */
	@Prop({ reflect: true }) prevEnabled: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) nextEnabled: boolean = true;

	/** @inheritdoc */
	@Event() stepClick: EventEmitter<number>;
	/** @inheritdoc */
	@Event() prevClick: EventEmitter<void>;
	/** @inheritdoc */
	@Event() nextClick: EventEmitter<void>;

	private onPrevClick = () => {
		this.prevClick.emit();
	};

	private onNextClick = () => {
		this.nextClick.emit();
	};

	private onStepClick = ({ detail }: CustomEvent<number>) => {
		this.stepClick.emit(detail);
	};

	render() {
		return (
			<Host>
				<div class="wizard-footer-container">
					<div class="wizard-stepper">
						{this.showStepBar && (
							<kv-step-bar
								label={this.label}
								steps={this.steps}
								currentStep={this.currentStep}
								progressPercentage={this.progressPercentage}
								hasError={this.hasError}
								onStepClicked={this.onStepClick}
							/>
						)}
					</div>
					<div class="actions-container">
						<slot name="additional-actions" />
						{!isEmpty(this.prevBtnLabel) && (
							<kv-action-button-text type={EActionButtonType.Tertiary} text={this.prevBtnLabel} disabled={!this.prevEnabled} onClickButton={this.onPrevClick} />
						)}
						<kv-action-button-text type={EActionButtonType.Primary} text={this.nextBtnLabel} disabled={!this.nextEnabled} onClickButton={this.onNextClick} />
					</div>
				</div>
			</Host>
		);
	}
}

import { Component, Event, EventEmitter, Prop, h, State, Watch } from '@stencil/core';
import { IWizardFooter } from '../wizard-footer/wizard-footer.types';
import { IWizardHeader } from '../wizard-header/wizard-header.types';
import { buildFooterConfig, buildHeaderConfig } from './wizard.helper';
import { IWizard, IWizardEvents, IWizardStep, StepState } from './wizard.types';

@Component({
	tag: 'kv-wizard',
	styleUrl: 'wizard.scss',
	shadow: true
})
export class KvWizard implements IWizard, IWizardEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) steps!: IWizardStep[];
	/** @inheritdoc */
	@Prop({ reflect: true }) currentStep!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) currentStepState?: StepState;
	/** @inheritdoc */
	@Prop({ reflect: true }) showHeader: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) showStepBar: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) completeBtnLabel?: string;

	/** @inheritdoc */
	@Event() goToStep: EventEmitter<number>;
	/** @inheritdoc */
	@Event() completeClick: EventEmitter<void>;
	/** @inheritdoc */
	@Event() cancelClick: EventEmitter<void>;

	/** Internal header state */
	@State() currentHeader: IWizardHeader;
	/** Internal footer state */
	@State() currentFooter: IWizardFooter;

	/** Watch the `steps` property and update internal state accordingly */
	@Watch('steps')
	stepsChangeHandler(newValue: IWizardStep[]) {
		this.currentHeader = buildHeaderConfig(newValue, this.currentStep);
		this.currentFooter = buildFooterConfig(newValue, this.currentStep, this.currentStepState, this.disabled);
	}
	/** Watch the `currentStep` property and update internal state accordingly */
	@Watch('currentStep')
	currentStepChangeHandler(newValue: number) {
		this.currentHeader = buildHeaderConfig(this.steps, newValue);
		this.currentFooter = buildFooterConfig(this.steps, newValue, this.currentStepState, this.disabled);
	}
	/** Watch the `currentStepState` property and update internal state accordingly */
	@Watch('currentStepState')
	hasErrorStepChangeHandler(newValue: StepState) {
		this.currentFooter = buildFooterConfig(this.steps, this.currentStep, newValue, this.disabled);
	}

	componentWillLoad() {
		this.currentHeader = buildHeaderConfig(this.steps, this.currentStep);
		this.currentFooter = buildFooterConfig(this.steps, this.currentStep, this.currentStepState, this.disabled);
	}

	onPrevClick = () => {
		this.goToStep.emit(this.currentStep - 1);
	};

	onNextClick = () => {
		this.goToStep.emit(this.currentStep + 1);
	};

	onStepClick = ({ detail }: CustomEvent<number>) => {
		this.goToStep.emit(detail);
	};

	render() {
		return (
			<div class="wizard">
				{this.showHeader && (
					<div class="wizard-header">
						{this.currentHeader && (
							<kv-wizard-header {...this.currentHeader}>
								<slot slot="additional-header-actions" name="additional-header-actions" />
							</kv-wizard-header>
						)}
					</div>
				)}
				<div class={{ 'wizard-content': true, 'has-header': this.showHeader }}>
					<slot name="step-content"></slot>
				</div>
				<div class="wizard-footer">
					<kv-wizard-footer
						onPrevClick={this.onPrevClick}
						onNextClick={this.onNextClick}
						onStepClick={this.onStepClick}
						showStepBar={this.showStepBar}
						completeBtnLabel={this.completeBtnLabel}
						exportparts="footer-actions-container"
						{...this.currentFooter}
					>
						<slot slot="additional-actions" name="additional-actions" />
					</kv-wizard-footer>
				</div>
			</div>
		);
	}
}

import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { IStepBar, IStepBarEvents, IStepBarStep } from './step-bar.types';
import { DEFAULT_LABEL } from './step-bar.config';

@Component({
	tag: 'kv-step-bar',
	styleUrl: 'step-bar.scss',
	shadow: true
})
export class KvStepBar implements IStepBar, IStepBarEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label: string = DEFAULT_LABEL;
	/** @inheritdoc */
	@Prop({ reflect: true }) steps!: IStepBarStep[];
	/** @inheritdoc */
	@Prop({ reflect: true }) currentStep!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) progressPercentage!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) hasError: boolean = false;

	/** @inheritdoc */
	@Event() stepClicked: EventEmitter<number>;

	private onStepClick = (idx: number) => {
		this.stepClicked.emit(idx);
	};

	render() {
		if (!this.steps) {
			return;
		}

		return (
			<Host>
				<div class="label-container">
					<span class="label">{this.label}</span>
					<span class="step-counter">
						{this.currentStep + 1} / {this.steps.length} Steps
					</span>
				</div>
				<div class="progress-bar-container">
					<kv-step-progress-bar progressPercentage={this.progressPercentage}>
						{this.steps.map(({ active, enabled, hasError, stepKey }, idx) => (
							<div class="step-indicator-container">
								<kv-step-indicator
									class="step-indicator"
									key={stepKey}
									enabled={enabled}
									active={active}
									hasError={hasError}
									isCurrent={idx === this.currentStep}
									onIndicatorClicked={this.onStepClick.bind(this, idx)}
								/>
							</div>
						))}
					</kv-step-progress-bar>
				</div>
			</Host>
		);
	}
}

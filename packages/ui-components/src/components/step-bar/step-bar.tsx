import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { IStepIndicator } from '../step-indicator/step-indicator.types';
import { IStepBar, IStepBarEvents } from './step-bar.types';

@Component({
	tag: 'kv-step-bar',
	styleUrls: {
		night: 'step-bar.night.scss'
	},
	shadow: true
})
export class KvStepBar implements IStepBar, IStepBarEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label: string = 'Progress:';
	/** @inheritdoc */
	@Prop({ reflect: true }) steps!: IStepIndicator[];
	/** @inheritdoc */
	@Prop({ reflect: true }) currentStep!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) progressPercentage!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) hasError: boolean;

	/** @inheritdoc */
	@Event() stepClicked: EventEmitter<number>;

	private onStepClick = ({ detail }: CustomEvent<number>) => {
		this.stepClicked.emit(detail);
	};

	render() {
		return (
			<Host>
				<div class="label-container">
					<span class="label">{this.label}</span>
					<span class="step-counter">
						{this.currentStep + 1}/{this.steps.length} Steps
					</span>
				</div>
				<div class="progress-bar-container">
					<kv-step-progress-bar progressPercentage={this.progressPercentage} hasError={this.hasError}>
						{this.steps.map(({ active, enabled, hasError }, idx) => (
							<kv-step-indicator stepKey={idx} enabled={enabled} active={active} hasError={hasError} onIndicatorClicked={this.onStepClick} />
						))}
					</kv-step-progress-bar>
				</div>
			</Host>
		);
	}
}

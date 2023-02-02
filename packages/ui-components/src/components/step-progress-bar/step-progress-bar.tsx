import { Component, Host, Prop, h } from '@stencil/core';
import { IStepProgressBar } from './step-progress-bar.types';

@Component({
	tag: 'kv-step-progress-bar',
	styleUrls: {
		night: 'step-progress-bar.night.scss'
	},
	shadow: true
})
export class KvStepProgressBar implements IStepProgressBar {
	/** @inheritdoc */
	@Prop({ reflect: true }) progressPercentage!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) hasError: boolean;

	render() {
		return (
			<Host>
				<div class="progress-wrapper">
					<div
						class={{
							'progress-bar-filler': true,
							'error': this.hasError
						}}
						style={{ width: this.progressPercentage + '%' }}
					/>
					<div class="steps-container">
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}

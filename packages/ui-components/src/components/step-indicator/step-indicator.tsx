import { Component, Host, Prop, Event, EventEmitter, h } from '@stencil/core';
import { IStepIndicator, IStepIndicatorEvents } from './step-indicator.types';
import { EIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-step-indicator',
	styleUrl: 'step-indicator.scss',
	shadow: true
})
export class KvStepIndicator implements IStepIndicator, IStepIndicatorEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) enabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) active?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) hasError?: boolean;
	/** (optional) Defines if the step is the current step */
	@Prop() isCurrent?: boolean;

	/** @inheritdoc */
	@Event() indicatorClicked: EventEmitter<MouseEvent>;

	private onIndicatorClick = (event: MouseEvent) => {
		if (this.enabled) {
			this.indicatorClicked.emit(event);
		}
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'indicator': true,
						'indicator--state-enabled': this.enabled,
						'indicator--state-active': this.active,
						'indicator--state-error': this.hasError
					}}
					onClick={this.onIndicatorClick}
				>
					{!this.isCurrent && this.active && <kv-icon name={this.hasError ? EIconName.Error : EIconName.Success}></kv-icon>}
				</div>
			</Host>
		);
	}
}

import { Component, Host, Prop, Event, EventEmitter, h } from '@stencil/core';
import { IStepIndicator, IStepIndicatorEvents } from './step-indicator.types';

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

	/** @inheritdoc */
	@Event() indicatorClicked: EventEmitter<void>;

	private onIndicatorClick = () => {
		if (this.enabled) {
			this.indicatorClicked.emit();
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
				></div>
			</Host>
		);
	}
}

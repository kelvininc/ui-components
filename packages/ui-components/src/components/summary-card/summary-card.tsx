import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { ESummaryCardType } from './summary-card.types';
@Component({
	tag: 'kv-summary-card',
	styleUrls: {
		light: 'summary-card.light.scss',
		night: 'summary-card.night.scss'
	},
	shadow: true
})
export class KvSummaryCard {
	/** (required) Used to define font styling according to the data type */
	@Prop() type!: ESummaryCardType;
	/** (optional) Defines loading styling for this card */
	@Prop() loading: boolean = false;
	/** (optional) The label to use at the top of the card */
	@Prop() label: string = '';

	/** Watch for changes on the prop label and apply it to the internal state */
	@Watch('label')
	labelChangeHandler(newValue?: string) {
		this._label = !isEmpty(newValue) ? newValue : '- -';
	}

	/** (optional) The subtitle of the card */
	@Prop() subtitle: string;
	/** (optional) A brief description of the card's info */
	@Prop() description: string;

	/** The internal label state, updated when prop label changes */
	@State() _label: string = !isEmpty(this.label) ? this.label : '- -';

	render() {
		return (
			<Host>
				<div
					class={{
						'summary-card-container': true,
						'loading': this.loading
					}}
				>
					<div
						class={{
							label: true,
							number: this.type === ESummaryCardType.Number
						}}
					>
						{!this.loading && this._label}
					</div>
					<div class="subtitle">{!this.loading && this.subtitle}</div>
					<div class="description">{!this.loading && this.description}</div>
				</div>
			</Host>
		);
	}
}

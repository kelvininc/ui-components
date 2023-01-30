import { Component, Host, Prop, h } from '@stencil/core';
import { IWizardHeader } from './wizard-header.types';

@Component({
	tag: 'kv-wizard-header',
	styleUrls: {
		night: 'wizard-header.night.scss'
	},
	shadow: true
})
export class KvWizardHeader implements IWizardHeader {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description!: string;

	render() {
		return (
			<Host>
				<div class="wizard-header-container">
					<span class="label">{this.label}</span>
					<span class="separator"></span>
					<span class="description">{this.description}</span>
				</div>
			</Host>
		);
	}
}

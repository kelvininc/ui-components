import { Component, Host, Prop, h } from '@stencil/core';
import { IWizardHeader } from './wizard-header.types';
import { EIconName, ETooltipPosition } from '../../types';

@Component({
	tag: 'kv-wizard-header',
	styleUrl: 'wizard-header.scss',
	shadow: true
})
export class KvWizardHeader implements IWizardHeader {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) tip?: string;

	render() {
		return (
			<Host>
				<div class="wizard-header-container">
					<span class="label">{this.label}</span>
					<span class="separator" />
					<span class="description">{this.description}</span>
					{this.tip?.length > 0 && (
						<kv-toggle-tip text={this.tip} position={ETooltipPosition.Bottom} customClass="wizard-header-tip">
							<kv-icon name={EIconName.Info} slot="open-element-slot" />
						</kv-toggle-tip>
					)}
				</div>
			</Host>
		);
	}
}

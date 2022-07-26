import { Component, h, Host, Prop } from '@stencil/core';

@Component({
	tag: 'kv-form-label',
	styleUrls: {
		night: 'form-label.night.scss',
		light: 'form-label.light.scss'
	},
	shadow: true
})
export class KvFormLabel {
	/** (required) Form field label */
	@Prop({ reflect: true }) label!: string;

	/** (optional) Form field required */
	@Prop({ reflect: true }) required?: boolean;

	render() {
		return (
			<Host>
				<div class="form-field-container">
					{this.label && (
						<div class="label-container">
							{this.required && <span class="required">*</span>}
							{this.label && <span class="label">{this.label}</span>}
						</div>
					)}
				</div>
			</Host>
		);
	}
}

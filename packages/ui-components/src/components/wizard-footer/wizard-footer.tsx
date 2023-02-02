import { Component, Host, h } from '@stencil/core';

@Component({
	tag: 'kv-wizard-footer',
	styleUrl: 'wizard-footer.scss',
	shadow: true
})
export class KvWizardFooter {
	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		);
	}
}

import { Component, Host, Prop, h } from '@stencil/core';
import { ITutorialHeader } from './tutorial-header.types';

@Component({
	tag: 'kv-tutorial-header',
	styleUrls: {
		night: 'tutorial-header.night.scss'
	},
	shadow: true
})
export class KvTutorialHeader implements ITutorialHeader {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) separator: string = '-';

	render() {
		return (
			<Host>
				<div class="tutorial-header-container">
					<span class="label">{this.label}</span>
					<span class="separator">{this.separator}</span>
					<span class="description">{this.description}</span>
				</div>
			</Host>
		);
	}
}

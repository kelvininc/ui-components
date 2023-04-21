import { Component, Host, Prop, h } from '@stencil/core';
import { isValidLabel } from '../../utils/string.helper';

@Component({
	tag: 'kv-tag',
	styleUrl: 'tag.scss',
	shadow: true
})
export class KvTag {
	/** (optional) Tag label */
	@Prop({ reflect: true }) label?: string;

	render() {
		return (
			<Host>
				<div class="tag-container">
					<slot name="left-slot"></slot>
					{isValidLabel(this.label) && <div class="tag-label">{this.label}</div>}
				</div>
			</Host>
		);
	}
}

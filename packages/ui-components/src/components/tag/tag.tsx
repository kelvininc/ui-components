import { Component, Host, Prop, h } from '@stencil/core';
import { isValidLabel } from '../../utils/string.helper';
import { EComponentSize } from '../../types';

@Component({
	tag: 'kv-tag',
	styleUrl: 'tag.scss',
	shadow: true
})
export class KvTag {
	/** (optional) Tag label */
	@Prop({ reflect: true }) label?: string;
	/** (optional) Sets the size of tag */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;

	render() {
		return (
			<Host>
				<div class={{ 'tag-container': true, [`tag-container--size-${this.size}`]: true }}>
					<slot name="left-slot"></slot>
					{isValidLabel(this.label) && <div class="tag-label">{this.label}</div>}
				</div>
			</Host>
		);
	}
}

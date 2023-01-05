import { Component, Host, h, Prop } from '@stencil/core';
import { STATUS_CONFIG } from './tag-status.config';
import { ETagStatusType, ITagStatus } from './tag-status.types';

@Component({
	tag: 'kv-tag-status',
	styleUrl: 'tag-status.scss',
	shadow: true
})
export class KvTagStatus implements ITagStatus {
	@Prop({ reflect: true }) type: ETagStatusType = ETagStatusType.Unknown;

	render() {
		const { state, icon, label } = STATUS_CONFIG[this.type];

		return (
			<Host>
				<div class={`status-container status-${state}`}>
					<kv-icon name={icon} />
					<span class="status-label">{label}</span>
				</div>
			</Host>
		);
	}
}

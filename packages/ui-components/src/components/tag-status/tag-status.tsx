import { Component, Host, h, Prop } from '@stencil/core';
import { ETagState, ITagStatus } from './tag-status.types';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { isEmpty } from 'lodash';

@Component({
	tag: 'kv-tag-status',
	styleUrl: 'tag-status.scss',
	shadow: true
})
export class KvTagStatus implements ITagStatus {
	/** @inheritdoc */
	@Prop({ reflect: true }) state!: ETagState;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon!: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;

	render() {
		return (
			<Host>
				<div class={`status-container status-${this.state}`}>
					<kv-icon name={this.icon} />
					{!isEmpty(this.label) && <span class="status-label">{this.label}</span>}
				</div>
			</Host>
		);
	}
}

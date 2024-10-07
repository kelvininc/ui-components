import { Component, Host, h, Prop } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { ETagState, ITagStatus } from './tag-status.types';
import { EIconName, EOtherIconName } from '../icon/icon.types';

/**
 * @part label - The label element.
 */
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
				<div class="tag-status">
					<div
						class={{
							icon: true,
							[`icon--state-${this.state}`]: true
						}}
					>
						<kv-icon name={this.icon} exportparts="icon" />
					</div>
					{!isEmpty(this.label) && (
						<div class="label" part="label">
							{this.label}
						</div>
					)}
				</div>
			</Host>
		);
	}
}

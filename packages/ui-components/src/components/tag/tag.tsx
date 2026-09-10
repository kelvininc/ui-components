import { Component, Host, Prop, h } from '@stencil/core';
import { isValidLabel } from '../../utils/string.helper';
import { EIconName } from '../icon/icon.types';
import { ETagColor } from './tag.types';
import { EComponentSize } from '../../types';
import { EBadgeType } from '../badge/badge.types';

@Component({
	tag: 'kv-tag',
	styleUrl: 'tag.scss',
	shadow: true
})
export class KvTag {
	/** (optional) Tag label */
	@Prop({ reflect: true }) label?: string;
	/** (optional) Tag color variant */
	@Prop({ reflect: true }) color: ETagColor = ETagColor.Neutral;
	/** (optional) Tag size variant */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;
	/** (optional) Icon to display inside the tag */
	@Prop({ reflect: true }) icon?: EIconName;
	/** (optional) Badge label displayed at the end of the tag */
	@Prop({ reflect: true }) badgeLabel?: string;

	render() {
		return (
			<Host>
				<div class={{ 'tag-container': true, [`tag-container--color-${this.color}`]: true, [`tag-container--size-${this.size}`]: true }}>
					<slot name="left-slot">{this.icon && <kv-icon name={this.icon} exportparts="icon" />}</slot>
					{isValidLabel(this.label) && <div class="tag-label">{this.label}</div>}
					<slot name="right-slot">{isValidLabel(this.badgeLabel) && <kv-badge type={EBadgeType.Secondary}>{this.badgeLabel}</kv-badge>}</slot>
				</div>
			</Host>
		);
	}
}

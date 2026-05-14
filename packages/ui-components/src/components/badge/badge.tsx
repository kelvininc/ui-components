import { Component, Host, h, Prop } from '@stencil/core';
import { EBadgeType, IBadge } from './badge.types';

/**
 * @part badge - The badge.
 */
@Component({
	tag: 'kv-badge',
	styleUrl: 'badge.scss',
	shadow: true
})
export class KvBadge implements IBadge {
	/** (optional) Defines the badge type.*/
	@Prop({ reflect: true }) type: EBadgeType = EBadgeType.Primary;
	/** (optional) If `true` the badge is in disabled state. */
	@Prop({ reflect: true }) disabled: boolean = false;

	render() {
		return (
			<Host>
				<span class={{ badge: true, [`badge--type-${this.type}`]: true, disabled: this.disabled }} part="badge">
					<slot />
				</span>
			</Host>
		);
	}
}

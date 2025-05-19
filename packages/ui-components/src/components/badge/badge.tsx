import { Component, Host, h, Prop } from '@stencil/core';
import { EBadgeState, IBadge } from './badge.types';

/**
 * @part badge - The badge.
 */
@Component({
	tag: 'kv-badge',
	styleUrl: 'badge.scss',
	shadow: true
})
export class KvBadge implements IBadge {
	/** (optional) Defines the badge state.*/
	@Prop({ reflect: true }) state: EBadgeState = EBadgeState.None;

	render() {
		return (
			<Host>
				<span class={`badge badge--state-${this.state}`} part="badge">
					<slot />
				</span>
			</Host>
		);
	}
}

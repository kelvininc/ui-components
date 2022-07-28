import { Component, Host, h } from '@stencil/core';

/**
 * @part badge - The badge.
 */
@Component({
	tag: 'kv-badge',
	styleUrl: 'badge.scss',
	shadow: true
})
export class KvBadge {
	render() {
		return (
			<Host>
				<span class="badge" part="badge">
					<slot />
				</span>
			</Host>
		);
	}
}

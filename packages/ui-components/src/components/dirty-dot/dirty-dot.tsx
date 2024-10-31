import { Component, Host, h } from '@stencil/core';
import { EIconName } from '../icon/icon.types';

/**
 * @part dot - The dot container.
 */
@Component({
	tag: 'kv-dirty-dot',
	styleUrl: 'dirty-dot.scss',
	shadow: true
})
export class KvDirtyDot {
	render() {
		return (
			<Host>
				<kv-icon name={EIconName.Circle} class="dot" part="dot" />
			</Host>
		);
	}
}

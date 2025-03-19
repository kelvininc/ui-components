import { Component, Host, Prop, h } from '@stencil/core';

import { ITooltipText } from './tooltip-text.types';

/**
 * @part tooltip-container - The tooltip container.
 * @part tooltip-slot-content - The tooltip slot content.
 */
@Component({
	tag: 'kv-tooltip-text',
	styleUrl: 'tooltip-text.scss',
	shadow: true
})
export class KvTooltipText implements ITooltipText {
	/** @inheritdoc */
	@Prop({ reflect: true }) text: string = '';

	render() {
		return (
			<Host>
				<div class="tooltip-container" part="tooltip-container">
					{this.text && <div class="tooltip-text">{this.text}</div>}
					<div class="tooltip-slot" part="tooltip-slot-content">
						<slot />
					</div>
				</div>
			</Host>
		);
	}
}

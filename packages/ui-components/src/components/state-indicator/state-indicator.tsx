import { Component, Prop, h, Host } from '@stencil/core';

@Component({
	tag: 'kv-state-indicator',
	styleUrl: 'state-indicator.scss',
	shadow: true
})
export class KvStateIndicator {
	/** (optional) State indicator color */
	@Prop({ reflect: true }) color: string;
	/** (optional) State indicator text */
	@Prop({ reflect: true }) text: string;

	render() {
		return (
			<Host>
				<div class="state-indicator">
					{this.color && <div class="color" style={{ background: this.color }}></div>}
					<div class="text">{this.text}</div>
				</div>
			</Host>
		);
	}
}

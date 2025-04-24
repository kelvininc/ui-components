import { Component, Host, Prop, h } from '@stencil/core';

@Component({
	tag: 'kv-loader',
	styleUrl: 'loader.scss',
	shadow: true
})
export class KvLoader {
	/** (optional) If `true` the loader is enabled */
	@Prop({ reflect: true }) isLoading: boolean = false;
	/** (optional) If `true` the loader is overlay */
	@Prop({ reflect: true }) hasOverlay: boolean = false;

	render() {
		return (
			<Host>
				{this.isLoading && (
					<div class="loader-container">
						{this.hasOverlay && <div class="overlay"></div>}
						<div class="loader"></div>
					</div>
				)}
			</Host>
		);
	}
}

import { Component, Prop, Host, h } from '@stencil/core';

@Component({
	tag: 'kv-svg-icon',
	styleUrl: 'svg-icon.scss',
	shadow: true
})
export class KvSvgIcon {
	/** (optional) Icon's symbol name */
	@Prop({ reflect: true }) name: string = '';

	customClass = '';
	customColor = '';

	render() {
		return (
			<Host>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class={{
						'svg-icon': true,
						[this.customClass ?? '']: true
					}}
					fill={this.customColor}
				>
					<use href={`svg-symbols.svg#${this.name}`}></use>
				</svg>
			</Host>
		);
	}
}

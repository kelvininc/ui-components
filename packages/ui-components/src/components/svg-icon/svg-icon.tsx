import { Component, Prop, Host, h } from '@stencil/core';
import { getClassMap } from '../../utils/css-class.helper';

/**
 * @part icon - The icon container.
 */
@Component({
	tag: 'kv-svg-icon',
	styleUrl: 'svg-icon.scss',
	shadow: true
})
export class KvSvgIcon {
	/** (required) Icon symbol name */
	@Prop({ reflect: true }) name!: string;

	/** (required) Url where assets are public served */
	@Prop({ reflect: true }) assetsUrl: string = '';

	/**
	 * (optional) Additional classes to apply for custom CSS. If multiple classes are
	 * provided they should be separated by spaces.
	 */
	@Prop({ reflect: true }) customClass: string | string[] = '';

	/** (optional) Icon custom color */
	@Prop({ reflect: true }) customColor: string = '';

	render() {
		return (
			<Host>
				<svg
					part="icon"
					xmlns="http://www.w3.org/2000/svg"
					class={{
						...getClassMap(this.customClass),
						'svg-icon': true
					}}
					style={{ fill: this.customColor }}
				>
					<use href={`${this.assetsUrl}svg-symbols.svg#${this.name}`}></use>
				</svg>
			</Host>
		);
	}
}

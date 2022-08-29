import { Component, Prop, Host, h } from '@stencil/core';
import { getClassMap } from '../../utils/css-class.helper';
import { getConfig } from '../utils';
import { EIllustrationName } from './illustration.types';

/**
 * @part illustration - The illustration container.
 */
@Component({
	tag: 'kv-illustration',
	styleUrl: 'illustration.scss',
	shadow: true
})
export class KvIllustration {
	/** (required) Illustration symbol name */
	@Prop({ reflect: true }) name!: EIllustrationName;

	/**
	 * (optional) Additional classes to apply for custom CSS. If multiple classes are
	 * provided they should be separated by spaces.
	 */
	@Prop({ reflect: true }) customClass: string | string[] = '';

	render() {
		const { baseAssetsUrl, symbolsFileName, styleMode } = getConfig();

		return (
			<Host>
				<svg
					part="illustration"
					xmlns="http://www.w3.org/2000/svg"
					class={{
						...getClassMap(this.customClass),
						illustration: true
					}}
				>
					<use href={`${baseAssetsUrl}${symbolsFileName}#${this.name}-${styleMode}`}></use>
				</svg>
			</Host>
		);
	}
}

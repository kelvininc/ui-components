import { Component, Prop, h, Host } from '@stencil/core';
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
		const Tag = this.name;

		return (
			<Host>
				<Tag customClass={this.customClass} />
			</Host>
		);
	}
}

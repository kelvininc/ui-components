import { Component, Prop, h, Host } from '@stencil/core';
import { EIllustrationName } from './illustration.types';
import { CustomCssClass, ICustomCss } from '../../types';

/**
 * @part illustration - The illustration container.
 */
@Component({
	tag: 'kv-illustration',
	styleUrl: 'illustration.scss',
	shadow: true
})
export class KvIllustration implements ICustomCss {
	/** (required) Illustration symbol name */
	@Prop({ reflect: true }) name!: EIllustrationName;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';

	render() {
		const Tag = this.name;

		return (
			<Host>
				<Tag customClass={this.customClass} />
			</Host>
		);
	}
}

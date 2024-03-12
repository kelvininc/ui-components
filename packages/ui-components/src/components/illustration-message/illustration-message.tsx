import { Component, Prop, h } from '@stencil/core';
import { EIllustrationName } from '../../types';
import { IIllustrationMessage } from './illustration-message.types';

/**
 * @part illustration - The illustration container.
 * @part header - The header container.
 * @part description - The description container.
 */
@Component({
	tag: 'kv-illustration-message',
	styleUrl: 'illustration-message.scss',
	shadow: true
})
export class KvIllustrationMessage implements IIllustrationMessage {
	/** @inheritdoc */
	@Prop({ reflect: true }) illustration: EIllustrationName;
	/** @inheritdoc */
	@Prop({ reflect: true }) header: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description?: string;

	render() {
		return (
			<div class="illustration-message">
				<kv-illustration name={this.illustration} class="image" part="illustration" />
				<div class="header" part="header">
					{this.header}
				</div>
				{this.description && (
					<div class="description" part="description">
						{this.description}
					</div>
				)}
			</div>
		);
	}
}

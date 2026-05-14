import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { ILink } from './link.types';
import { EAnchorTarget, EIconName } from '../../types';

/**
 * @part container - The link's container
 * @part label - The link's label
 */
@Component({
	tag: 'kv-link',
	styleUrl: 'link.scss',
	shadow: true
})
export class KvLink implements ILink {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) leftIcon?: EIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) rightIcon?: EIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) subtitle?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled? = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) inline? = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) href?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) target?: EAnchorTarget;

	/** Emitted when clicking the label */
	@Event() labelClick: EventEmitter<MouseEvent>;

	private onLabelClick = event => {
		this.labelClick.emit(event);
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'link-container': true,
						'link-container--disabled': this.disabled
					}}
					part="container"
				>
					<a
						tabIndex={this.disabled ? -1 : 0}
						class={{
							'label': true,
							'label--disabled': this.disabled,
							'label--inline': this.inline
						}}
						href={this.href}
						target={this.target}
						onClick={this.onLabelClick}
						part="label"
					>
						<slot name="left">{this.leftIcon && <kv-icon name={this.leftIcon} />}</slot>
						{this.label && <span part="label-text">{this.label}</span>}
						<slot name="right">{this.rightIcon && <kv-icon name={this.rightIcon} />}</slot>
					</a>
					{this.subtitle && <div class="subtitle">{this.subtitle}</div>}
				</div>
			</Host>
		);
	}
}

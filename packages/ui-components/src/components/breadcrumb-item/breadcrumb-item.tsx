import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { throttle } from 'lodash-es';
import { EAnchorTarget } from '../../utils/types';
import { IBreadcrumbItem, IBreadcrumbItemEvents } from './breadcrumb-item.types';

/**
 * @part anchor - The anchor element.
 */
@Component({
	tag: 'kv-breadcrumb-item',
	styleUrl: 'breadcrumb-item.scss',
	shadow: true
})
export class KvBreadcrumbItem implements IBreadcrumbItem, IBreadcrumbItemEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) href?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) target?: EAnchorTarget;
	/** @inheritdoc */
	@Prop({ reflect: true }) download?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) active?: boolean;

	/** @inheritdoc */
	@Event() breadcrumbItemClick: EventEmitter<IBreadcrumbItem>;

	connectedCallback() {
		this.clickThrottler = throttle(() => this.onItemClick(), 300);
	}

	private clickThrottler: () => void;
	private onItemClick = () => {
		this.breadcrumbItemClick.emit({
			label: this.label,
			href: this.href,
			target: this.target,
			active: this.active
		});
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'breadcrumb-item': true,
						'breadcrumb-item--active': this.active
					}}
				>
					<a href={this.href} target={this.target} onClick={this.clickThrottler} part="anchor">
						{this.label}
					</a>
				</div>
			</Host>
		);
	}
}

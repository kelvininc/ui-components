import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { throttle } from 'lodash-es';
import { EAnchorTarget, IAnchor } from '../../utils/types';
import { IBreadcrumbItem } from './breadcrumb-item.types';

@Component({
	tag: 'kv-breadcrumb-item',
	styleUrl: 'breadcrumb-item.scss',
	shadow: true
})
export class KvBreadcrumbItem implements IAnchor {
	/** (required) The text to display on the breadcrumb */
	@Prop({ reflect: true }) label!: string;
	/** (optional) The breadcrumb's link */
	@Prop({ reflect: true }) href?: string;
	/** (optional) The target of the link (only used if href is provided) */
	@Prop({ reflect: true }) target?: EAnchorTarget;
	/** (optional) Sets this breadcrumb styling to be the active one (usually the last one) */
	@Prop({ reflect: true }) active?: boolean;
	/** (optional) The separator to use */
	@Prop() separator?: string;

	/** Emitted when the user clicks on the breadcrumb */
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
				<li
					class={{
						'breadcrumb-item': true,
						'active': this.active
					}}
				>
					<a href={this.href} target={this.target} onClick={this.clickThrottler}>
						{this.label}
					</a>
				</li>
				{this.separator && <span class="separator">{this.separator}</span>}
			</Host>
		);
	}
}

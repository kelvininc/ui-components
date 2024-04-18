import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { IBreadcrumbItem, IBreadcrumbItemEvents } from './breadcrumb-item.types';

@Component({
	tag: 'kv-breadcrumb-item',
	styleUrl: 'breadcrumb-item.scss',
	shadow: true
})
export class KvBreadcrumbItem implements IBreadcrumbItem, IBreadcrumbItemEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) active?: boolean;

	/** @inheritdoc */
	@Event() breadcrumbItemClick: EventEmitter<IBreadcrumbItem>;

	private onItemClick = () => {
		this.breadcrumbItemClick.emit({
			label: this.label,
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
					onClick={this.onItemClick}
				>
					<slot>{this.label}</slot>
				</div>
			</Host>
		);
	}
}

import { Component, h, Prop, Host, Event, EventEmitter, Listen } from '@stencil/core';
import { IBreadcrumbItem } from '../breadcrumb-item/breadcrumb-item.types';

@Component({
	tag: 'kv-breadcrumb',
	shadow: true
})
export class KvBreadcrumb {
	/** (required) List of breadcrumbs */
	@Prop({ reflect: true }) items: IBreadcrumbItem[] = [];
	/** (required) Separator to use between breadcrumb items */
	@Prop({ reflect: true }) separator: string = '/';

	/** Emitted when the user clicks on one of the breadcrumb items */
	@Event() itemClick: EventEmitter<IBreadcrumbItem>;

	/** Listen for the breadcrumb's item click event */
	@Listen('breadcrumbItemClick')
	itemClickHandler(event: CustomEvent<IBreadcrumbItem>) {
		this.itemClick.emit(event.detail);
	}

	render() {
		return (
			<Host>
				<kv-breadcrumb-list separator={this.separator}>
					{this.items.map((breadcrumb, idx, arr) => (
						<kv-breadcrumb-item
							label={breadcrumb.label}
							href={breadcrumb.href}
							target={breadcrumb.target}
							active={breadcrumb.active ?? idx === arr.length - 1}
						></kv-breadcrumb-item>
					))}
				</kv-breadcrumb-list>
			</Host>
		);
	}
}

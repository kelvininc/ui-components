import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';
import { IBreadcrumbItem, IBreadcrumbItemEvents } from '../breadcrumb-item/breadcrumb-item.types';

@Component({
	tag: 'kv-breadcrumb',
	shadow: true
})
export class KvBreadcrumb implements IBreadcrumbItemEvents {
	/** (required) List of breadcrumbs */
	@Prop({ reflect: true }) items: IBreadcrumbItem[] = [];

	/** @inheritdoc */
	@Event() breadcrumbItemClick: EventEmitter<IBreadcrumbItem>;

	render() {
		return (
			<Host>
				<kv-breadcrumb-list>
					{this.items.map(({ active, ...otherProps }, index, array) => (
						<kv-breadcrumb-item active={active ?? index === array.length - 1} exportparts="anchor" {...otherProps}></kv-breadcrumb-item>
					))}
				</kv-breadcrumb-list>
			</Host>
		);
	}
}

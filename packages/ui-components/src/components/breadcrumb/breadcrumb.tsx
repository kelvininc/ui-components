import { Component, h, Prop, Host, Event, EventEmitter } from '@stencil/core';
import { IBreadcrumbItem, IBreadcrumbItemEvents } from '../breadcrumb-item/breadcrumb-item.types';

/**
 * @part breadcrumb - The breadcrumb wrapper element.
 */
@Component({
	tag: 'kv-breadcrumb',
	styleUrl: 'breadcrumb.scss',
	shadow: true
})
export class KvBreadcrumb implements IBreadcrumbItemEvents {
	/** (required) List of breadcrumbs */
	@Prop({ reflect: true }) items: IBreadcrumbItem[] = [];

	@Event() breadcrumbItemClick: EventEmitter<IBreadcrumbItem>;

	render() {
		return (
			<Host>
				<div class="breadcrumb" part="breadcrumb">
					{this.items.map(({ active, ...otherProps }, index, array) => (
						<kv-breadcrumb-item active={active ?? index === array.length - 1} exportparts="anchor" {...otherProps}></kv-breadcrumb-item>
					))}
				</div>
			</Host>
		);
	}
}

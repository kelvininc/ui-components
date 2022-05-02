import { Component, Event, EventEmitter, h, Host } from '@stencil/core';
import { IBreadcrumbItem, IBreadcrumbItemEvents } from '../breadcrumb-item/breadcrumb-item.types';

/**
 * @part breadcrumb-list - The breadcrumb list element.
 */
@Component({
	tag: 'kv-breadcrumb-list',
	styleUrl: 'breadcrumb-list.scss',
	shadow: true
})
export class KvBreadcrumbList implements IBreadcrumbItemEvents {
	/** @inheritdoc */
	@Event() breadcrumbItemClick: EventEmitter<IBreadcrumbItem>;

	render() {
		return (
			<Host>
				<div class="breadcrumb-list" part="breadcrumb-list">
					<slot></slot>
				</div>
			</Host>
		);
	}
}

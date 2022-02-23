import { Component, Host, h, Prop, Element } from '@stencil/core';

@Component({
	tag: 'kv-breadcrumb-list',
	styleUrl: 'breadcrumb-list.scss',
	shadow: true
})
export class KvBreadcrumbList {
	/** (optional) The separator to use between breadcrumb items */
	@Prop() separator?: string = '/';

	/** The Host's element reference */
	@Element() el: HTMLKvBreadcrumbListElement;

	private breadcrumbItems: HTMLKvBreadcrumbItemElement[];

	componentDidRender() {
		this.breadcrumbItems = Array.from(this.el.querySelectorAll('kv-breadcrumb-item'));
		this.breadcrumbItems.forEach((item, idx) => {
			item.separator = idx !== this.breadcrumbItems.length - 1 ? this.separator : undefined;
		});
	}

	render() {
		return (
			<Host>
				<nav class="breadcrumb-container">
					<slot></slot>
				</nav>
			</Host>
		);
	}
}

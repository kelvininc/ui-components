```tsx
import { Component, h, State } from '@stencil/core';
import { IBreadcrumbItem, EBreadcrumbItemTarget } from 'ui-components';

@Component({
  tag: 'kv-breadcrumb-example',
  styleUrl: 'kv-breadcrumb-example.css',
  shadow: true,
})
export class KvBreadcrumbExample {
	/** 
	 * Depending on your objective you may consider using @Prop or @State
	 * https://stenciljs.com/docs/properties
	 * https://stenciljs.com/docs/state
	 * 
	*/
	@Prop() items: IBreadcrumbItem[] = [
		{
			label: 'Your item label here',
			href: 'Your item link here',
			/**
			 * Check https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
			 * for a list of possible values. At the moment 'framename' is not supported.
			 *
			 * We also provide a Typescript enum (EBreadcrumbItemTarget) to easily set this value
			*/
			target: '_blank',
			/**
			 * Not mandatory, by default the component will set the 'active' attribute to the last item on 
			 * the array, this will disable click events and emphasize the item in bold.
			*/
			active: undefined
		}
	];

  render() {
    return (
		// With items
		<kv-breadcrumb items={this.items}></kv-breadcrumb>
	);
  }
}
```
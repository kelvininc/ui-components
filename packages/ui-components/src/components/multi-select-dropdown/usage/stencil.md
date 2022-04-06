```tsx
import { Component, h } from '@stencil/core';
@Component({
  tag: 'kv-link-example',
  styleUrl: 'kv-link-example.css',
  shadow: true,
})
export class SwichButtonExample {
  render() {
    return (
		<kv-breadcrumb-list separator='/'>
			<kv-breadcrumb-item
				label="First item"
				link="Your link here"
				target={EBreadcrumbItemTarget.NewTab}
				active>
			</kv-breadcrumb-item>
			...
			<kv-breadcrumb-item
				label="Last item"
				link="Your link here"
				target={EBreadcrumbItemTarget.NewTab}
				active>
			</kv-breadcrumb-item>
		</kv-breadcrumb-list>
	)
  }
}
```
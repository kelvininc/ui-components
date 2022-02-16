```tsx
import { Component, h } from '@stencil/core';
@Component({
  tag: 'kv-link-example',
  styleUrl: 'kv-link-example.css',
  shadow: true,
})
export class KvBreadcrumbItemExample {
  render() {
    return (
		<KvBreadcrumbItem
			label="Your label here"
			link="Your link here"
			target={EBreadcrumbItemTarget.NewTab}
			separator='/'
			active>
		</KvBreadcrumbItem>
	);
  }
}
```
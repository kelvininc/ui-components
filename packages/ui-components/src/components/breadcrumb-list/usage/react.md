```tsx
import React from 'react';
import { KvBreadcrumbList } from '@kelvininc/react-ui-components';

export const KvBreadcrumbListExample: React.FC = () => (
  <>
    <KvBreadcrumbList>
		<KvBreadcrumbItem
			label="Your label here"
			href="https://your-link.here"
			target={EBreadcrumbItemTarget.NewTab}
			active>
		</KvBreadcrumbItem>
	</KvBreadcrumbList>
  </>
);
```

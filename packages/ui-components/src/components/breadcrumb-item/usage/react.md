```tsx
import React from 'react';
import { KvBreadcrumbItem } from '@kelvininc/react-ui-components';
export const KvBreadcrumbItemExample: React.FC = () => (
  <>
    {/*-- With all properties (only label is mandatory) --*/}
	<KvBreadcrumbItem
		label="Your label here"
		link="Your link here"
		target={EBreadcrumbItemTarget.NewTab}
		separator='/'
		active>
	</KvBreadcrumbItem>
  </>
);
```
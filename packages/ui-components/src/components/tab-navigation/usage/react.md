```tsx
import React from 'react';
import { KvTabNavigation } from '@kelvininc/react-ui-components';

export const TabNavigationExample: React.FC = () => (
	<>
		{/*-- With required props --*/}
		<KvTabNavigation tabs={myNavigationTabs} selectedTabKey="tab1"></KvTabNavigation>

		{/*-- With required props and notification --*/}
		<KvTabNavigation
			tabs={myNavigationTabs}
			selectedTabKey="tab1"
			notifications={myNavigationTabsNotifications}>
		</KvTabNavigation>
	</>
);
```

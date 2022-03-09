```tsx
import React from 'react';
import { KvTabItem } from '@kelvininc/react-ui-components';

export const TabItemExample: React.FC = () => (
	<>
		{/*-- With required props --*/}
		<KvTabItem tabKey="tab1" label="Tab 1" />

		{/*-- Disabled --*/}
		<KvTabItem tabKey="tab1" label="Tab 1" disabled></KvTabItem>

		{/*-- Selected --*/}
		<KvTabItem tabKey="tab1" label="Tab 1" selected></KvTabItem>

		{/*-- With Notification --*/}
		<KvTabItem tabKey="tab1" label="Tab 1" hasNotification></KvTabItem>

		{/*-- With Notification Color --*/}
		<KvTabItem tabKey="tab1" label="Tab 1" hasNotification notificationColor="#202020"></KvTabItem>
	</>
);
```

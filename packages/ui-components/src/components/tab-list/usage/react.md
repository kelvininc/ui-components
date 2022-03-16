```tsx
import React from 'react';
import { KvTabItem, KvTabList } from '@kelvininc/react-ui-components';

export const TabListExample: React.FC = () => (
	<>
		{/*-- With required props --*/}
		<KvTabList selectedTabKey="tab1">
			<KvTabItem tabKey="tab1" label="Tab 1" />
			<KvTabItem tabKey="tab2" label="Tab 2" />
			<KvTabItem tabKey="tab3" label="Tab 3" />
		</KvTabList>
	</>
);
```

```tsx
import React from 'react';
import { KvDropdownListItem } from '@kelvininc/react-ui-components';
export const KvDropdownListItemExample: React.FC = () => (
  <>
	{/*-- With all properties (only label and value are mandatory) --*/}
	<KvDropdownListItem
		label="Option 1"
		link="option1"
		selected={false}
		togglable={true}
		>
	</KvDropdownListItem>
  </>
);
```
```tsx
import React from 'react';

import { KvTagStatus, ETagStatusType } from '@kelvininc/react-ui-components';

export const TagStatusExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTagStatus />

		{/*-- With Type --*/}
		<KvTagStatus type={ETagStatusType.Running} />
	</>
);
```

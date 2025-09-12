```tsx
import React from 'react';

import { KvTagStatus, ETagStatusType } from '@kelvininc/react-ui-components/client';

export const TagStatusExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTagStatus state={ETagState.Error} icon={EIconName.Error} label="Failed"/>

		{/*-- Without label --*/}
		<KvTagStatus state={ETagState.Error} icon={EIconName.Error} />
	</>
);
```

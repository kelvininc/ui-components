```tsx
import React from 'react';

import { KvStateIndicator } from '@kelvininc/react-ui-components';

export const StateIndicatorExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvStateIndicator text="State Indicator" />
	
	{/*-- With Color --*/}
	<KvStateIndicator text="State Indicator" color="green" />
  </>
);

```

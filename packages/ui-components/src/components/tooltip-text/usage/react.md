```tsx
import React from 'react';

import { KvTooltipText } from '@kelvininc/react-ui-components';

export const TooltipTextExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvTooltipText text="Tooltip" />

	{/*-- visible --*/}
	<KvTooltipText text="Tooltip" visible={true} />
  </>
);
```

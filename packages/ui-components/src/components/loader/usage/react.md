```tsx
import React from 'react';

import { KvLoader } from '@kelvininc/react-ui-components';

export const LoaderExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvLoader is-loading />

	{/*-- Has Overlay --*/}
	<KvLoader is-loading has-overlay />
  </>
);

```

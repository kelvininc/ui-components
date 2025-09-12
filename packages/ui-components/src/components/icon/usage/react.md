```tsx
import React from 'react';

import { KvIcon } from '@kelvininc/react-ui-components/client';

export const SvgIconExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvIcon name="kv-logo-kelvin" />

		{/*-- Custom CSS --*/}
		<KvIcon name="kv-logo-kelvin" customClass="icon-24 rotate-90" />

		{/*-- Custom Color --*/}
		<KvIcon name="kv-logo-kelvin" customColor="#103d73" />
	</>
);
```

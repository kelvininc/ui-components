```tsx
import React from 'react';

import { KvSvgIcon } from '@kelvininc/react-ui-components';

export const SvgIconExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvSvgIcon name="kv-logo-kelvin" />

		{/*-- Custom CSS --*/}
		<KvSvgIcon name="kv-logo-kelvin" customClass="icon-24 rotate-90" />

		{/*-- Custom Color --*/}
		<KvSvgIcon name="kv-logo-kelvin" customColor="#103d73" />
	</>
);
```

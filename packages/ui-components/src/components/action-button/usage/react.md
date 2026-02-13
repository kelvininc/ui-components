```tsx
import React from 'react';

import { KvActionButton } from '@kelvininc/react-ui-components/client';

export const ActionButtonExample: React.FC = () => (
	<>
		{/*-- Primary --*/}
		<KvActionButton type={EActionButtonType.Primary}>Primary Button</KvActionButton>

		{/*--Secondary --*/}
		<KvActionButton type={EActionButtonType.Secondary}>Secondary Button</KvActionButton>

		{/*-- Tertiary --*/}
		<KvActionButton type={EActionButtonType.Tertiary}>Tertiary Button</KvActionButton>

		{/*-- Text --*/}
		<KvActionButton type={EActionButtonType.Text}>Text Button</KvActionButton>

		{/*-- Disabled --*/}
		<KvActionButton disabled type={EActionButtonType.Primary}>
			Disabled Button
		</KvActionButton>
	</>
);
```

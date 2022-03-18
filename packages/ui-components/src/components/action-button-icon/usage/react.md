```tsx
import React from 'react';

import { KvActionButtonIcon, EIconName } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
	<>
		{/*-- Primary --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Primary}></KvActionButtonIcon>

		{/*--Secondary --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Secondary}></KvActionButtonIcon>

		{/*-- Tertiary --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Tertiary}></KvActionButtonIcon>

		{/*-- Disabled --*/}
		<KvActionButtonIcon disabled icon={EIconName.Add} type={EActionButtonType.Primary}></KvActionButtonIcon>
	</>
);
```

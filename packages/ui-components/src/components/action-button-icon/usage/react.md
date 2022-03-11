```tsx
import React from 'react';

import { KvActionButtonIcon } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
	<>
		{/*-- Primary --*/}
		<KvActionButtonIcon icon="kv-add" type={EActionButtonType.Primary}></KvActionButtonIcon>

		{/*--Secondary --*/}
		<KvActionButtonIcon icon="kv-add" type={EActionButtonType.Secondary}></KvActionButtonIcon>

		{/*-- Tertiary --*/}
		<KvActionButtonIcon icon="kv-add" type={EActionButtonType.Tertiary}></KvActionButtonIcon>

		{/*-- Disabled --*/}
		<KvActionButtonIcon disabled icon="kv-add" type={EActionButtonType.Primary}></KvActionButtonIcon>
	</>
);
```

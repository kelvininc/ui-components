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

		{/*-- Ghost --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Ghost}></KvActionButtonIcon>

		{/*-- Danger --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Danger}></KvActionButtonIcon>

		{/*-- Disabled --*/}
		<KvActionButtonIcon disabled icon={EIconName.Add} type={EActionButtonType.Primary}></KvActionButtonIcon>

		{/*-- Anchor --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Primary} href="/link-to-url" target="_blank"></KvActionButtonIcon>

		{/*-- Badge --*/}
		<KvActionButtonIcon icon={EIconName.Customize} type={EActionButtonType.Primary} badge="12"></kv-action-button>
	</>
);
```

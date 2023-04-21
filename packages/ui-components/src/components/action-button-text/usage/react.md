```tsx
import React from 'react';

import { KvActionButtonText, EActionButtonType, EIconName } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
	<>
		{/*-- Primary --*/}
		<KvActionButtonText text="Primary Button" icon={EIconName.Add} type={EActionButtonType.Primary}></KvActionButtonText>

		{/*--Secondary --*/}
		<KvActionButtonText text="Secondary Button" icon={EIconName.Add} type={EActionButtonType.Secondary}></KvActionButtonText>

		{/*-- Tertiary --*/}
		<KvActionButtonText text="Tertiary Button" icon={EIconName.Add} type={EActionButtonType.Tertiary}></KvActionButtonText>

		{/*-- Ghost --*/}
		<KvActionButtonText text="Ghost Button" icon={EIconName.Add} type={EActionButtonType.Ghost}></KvActionButtonText>

		{/*-- Disabled --*/}
		<KvActionButtonText disabled text="Disabled Button" icon={EIconName.Add} type={EActionButtonType.Primary}></KvActionButtonText>

		{/*-- Anchor --*/}
		<KvActionButton href="/link-to-url" target="_blank" type={EActionButtonType.Primary} text="Anchor Button" icon={EIconName.Add}></KvActionButton>
	</>
);
```

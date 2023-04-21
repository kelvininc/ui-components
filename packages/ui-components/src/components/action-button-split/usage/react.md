```tsx
import React from 'react';

import { KvActionButtonText } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
	<>
		{/*-- Primary --*/}
		<KvActionButtonText text="Primary Button" icon={EIconName.Add}  splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Primary}></KvActionButtonText>

		{/*--Secondary --*/}
		<KvActionButtonText text="Secondary Button" icon={EIconName.Add}  splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Secondary}></KvActionButtonText>

		{/*-- Tertiary --*/}
		<KvActionButtonText text="Tertiary Button" icon={EIconName.Add}  splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Tertiary}></KvActionButtonText>

		{/*-- Ghost --*/}
		<KvActionButtonText text="Ghost Button" icon={EIconName.Add}  splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Ghost}></KvActionButtonText>

		{/*-- Disabled --*/}
		<KvActionButtonText disabled text="Disabled Button" icon={EIconName.Add}  splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Primary}></KvActionButtonText>

		{/*-- Anchor --*/}
		<KvActionButtonText text="Anchor Button" icon={EIconName.Add}  splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Tertiary} href="/link-to-url" target="_blank"></KvActionButtonText>
	</>
);
```

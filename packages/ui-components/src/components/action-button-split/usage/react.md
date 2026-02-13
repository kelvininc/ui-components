```tsx
import React from 'react';

import { KvActionButtonText } from '@kelvininc/react-ui-components/client';

export const ActionButtonTextExample: React.FC = () => (
	<>
		{/*-- Primary --*/}
		<KvActionButtonText text="Primary Button" icon={EIconName.Add} splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Primary}></KvActionButtonText>

		{/*--Secondary --*/}
		<KvActionButtonText text="Secondary Button" icon={EIconName.Add} splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Secondary}></KvActionButtonText>

		{/*-- Tertiary --*/}
		<KvActionButtonText text="Tertiary Button" icon={EIconName.Add} splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Tertiary}></KvActionButtonText>

		{/*-- Text --*/}
		<KvActionButtonText text="Text Button" icon={EIconName.Add} splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Text}></KvActionButtonText>

		{/*-- Disabled --*/}
		<KvActionButtonText disabled text="Disabled Button" icon={EIconName.Add} splitIcon={EIconNameArrowDropDown} type={EActionButtonType.Primary}></KvActionButtonText>
	</>
);
```

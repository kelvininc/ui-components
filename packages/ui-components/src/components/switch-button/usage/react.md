```tsx
import React from 'react';

import { KvSwitchButton } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
  <>
    {/*-- Default --*/}
    <KvSwitchButton/>

    {/*-- Labeled --*/}
	<KvSwitchButton label="Switch"/>

	{/*-- Disabled --*/}
	<KvSwitchButton disabled/>

	{/*-- ON/OFF --*/}
	<KvSwitchButton state="ON"/>
	<KvSwitchButton state="OFF"/>
  </>
);

```

```tsx
import React from 'react';

import { KvSwitchButton } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
  <>
    {/*-- Default --*/}
    <kv-switch-button></kv-switch-button>

    {/*-- Labeled --*/}
	<kv-switch-button label="Switch"></kv-switch-button>

	{/*-- Disabled --*/}
	<kv-switch-button disabled></kv-switch-button>

	{/*-- ON/OFF --*/}
	<kv-switch-button state="ON"></kv-switch-button>
	<kv-switch-button state="OFF"></kv-switch-button>
  </>
);

```

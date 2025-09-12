```tsx
import React from 'react';

import { KvToaster, EToasterType } from '@kelvininc/react-ui-components/client';

export const ToasterExample: React.FC = () => (
	<>
		{/*-- Info --*/}
		<KvToaster header="Main Message" type={EToasterType.Info}></KvToaster>

		{/*--Error --*/}
		<KvToaster header="Main Message" type={EToasterType.Error}></KvToaster>

		{/*-- Success --*/}
		<KvToaster header="Main Message" type={EToasterType.Success}></KvToaster>
		
		{/*-- Warning --*/}
		<KvToaster header="Main Message" type={EToasterType.Warning}></KvToaster>
	</>
)
```

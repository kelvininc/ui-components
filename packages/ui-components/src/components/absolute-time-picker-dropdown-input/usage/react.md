```tsx
import React from 'react';

import { KvAbsoluteTimePickerDropdownInput } from '@kelvininc/react-ui-components';

export const KvAbsoluteTimePickerDropdownInput: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvAbsoluteTimePickerDropdownInput />

		{/*-- With selected date --*/}
		<KvAbsoluteTimePickerDropdownInput selectedTime={[1681319856833, 1681406272018]} />

		{/*-- With initial date --*/}
		<KvAbsoluteTimePickerDropdownInput initialDate={1681319856833} />
	</>
);
```

```tsx
import React from 'react';
import { KvTimePickerSelectOption } from '@kelvininc/react-ui-components';
export const KvTimePickerSelectOptionExample: React.FC = () => (
  <>
	{/*-- With all properties (only label and value are mandatory) --*/}
	<KvTimePickerSelectOption
		label="Option 1"
		link="option1"
		selected={false}
		>
	</KvTimePickerSelectOption>
  </>
);
```

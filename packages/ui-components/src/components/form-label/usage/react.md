```tsx
import React from 'react';

import { KvFormLabel } from '@kelvininc/react-ui-components/client';

export const FormLabelExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvFormLabel />

		{/*-- Labeled --*/}
		<KvFormLabel label="Form Field" />

		{/*-- Labeled & Required --*/}
		<KvFormLabel label="Form Field" required />
	</>
);

```

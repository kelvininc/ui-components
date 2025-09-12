```jsx
import React from 'react';

import { KvWizardHeader } from '@kelvininc/react-ui-components/client';

export const WizardHeaderExamples = () => (
	<>
		{/*-- Required properties only --*/}
		<KvWizardHeader label="Label 1" description="Example label" />

		{/*-- Custom separator --*/}
		<KvWizardHeader label="Label 1" description="Example label" separator="/" />
	</>
);
```

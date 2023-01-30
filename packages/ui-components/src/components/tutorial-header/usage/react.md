```jsx
import React from 'react';

import { KvTutorialHeader } from '@kelvininc/react-ui-components';

export const TutorialHeaderExamples = () => (
	<>
		{/*-- Required properties only --*/}
		<KvTutorialHeader label="Label 1" description="Example label" />

		{/*-- Custom separator --*/}
		<KvTutorialHeader label="Label 1" description="Example label" separator="/" />
	</>
);
```

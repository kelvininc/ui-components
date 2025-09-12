```tsx
import React from 'react';

import { KvIllustration, EIllustrationName } from '@kelvininc/react-ui-components/client';

export const SvgIconExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvIllustration name={EIllustrationName.EsSectionSomethingwentwrong} />

		{/*-- Custom CSS --*/}
		<KvIllustration name={EIllustrationName.EsSectionSomethingwentwrong} customClass="illustration-full-size" />
	</>
);
```

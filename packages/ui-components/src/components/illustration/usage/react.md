```tsx
import React from 'react';

import { KvIllustration, EIllustrationName } from '@kelvininc/react-ui-components';

export const SvgIconExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvIllustration name={EIllustrationName.EsSectionSomethingwentwrong} />

		{/*-- Custom CSS --*/}
		<KvIllustration name={EIllustrationName.EsSectionSomethingwentwrong} customClass="illustration-full-size" />
	</>
);
```

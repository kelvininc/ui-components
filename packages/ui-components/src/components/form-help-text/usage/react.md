```tsx
import React from 'react';

import { KvFormHelpText } from '@kelvininc/react-ui-components';

export const FormHelpTextExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvFormHelpText helpText="Help text"/>

		{/*-- Default with array of strings --*/}
		<KvFormHelpText helpText={['Help text 1', 'Help Text2']} />

		{/*-- Default with error state --*/}
		<KvFormHelpText helpText="Help text" state={EValidationState.Invalid} />
	</>
);

```
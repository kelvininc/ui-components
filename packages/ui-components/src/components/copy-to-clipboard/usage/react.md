```tsx
import React from 'react';

import { KvCopyToClipboard } from '@kelvininc/react-ui-components/client';

export const KvCopyToClipboardExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCopyToClipboard copiableText="https://kelvin.ai" />

		{/*-- With custom copy tooltip suffix --*/}
		<KvCopyToClipboard copiableText="https://kelvin.ai" tooltipSuffix="Link" />

		{/*-- With content projection --*/}
		<KvCopyToClipboard copiableText="https://kelvin.ai" tooltipSuffix="Link">
			<span>Kelvin Website Link</span>
		</KvCopyToClipboard>
	</>
);
```

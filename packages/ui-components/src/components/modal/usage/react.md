```tsx
import React from 'react';

import { KvModal } from '@kelvininc/react-ui-components';

export const ModalExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvModal>
			<div className="header">This is a modal header</div>
			<div className="body">This is a modal body</div>
			<div className="footer">This is a modal footer</div>
		</KvModal>
	</>
);
```

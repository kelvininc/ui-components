```tsx
import React from 'react';
import { KvInputWrapper, KvTextField } from '@kelvininc/react-ui-components/client';

export const KvInputWrapperExample: React.FC = () => (
  <>
	<KvInputWrapper label="Options" contentVisible={false}>
		<KvTextField label="label" />
	</KvInputWrapper>
  </>
);
```

```tsx
import React from 'react';

import { KvTagLetter } from '@kelvininc/react-ui-components/client';

export const TagLetterExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvTagLetter label="Tag Letter" />
	
	{/*-- With Color --*/}
	<KvTagLetter label="Tag Letter" color="green" />

	{/*-- With Tag Letter --*/}
	<KvTagLetter label="Tag Letter" tagLetter="T" />
  </>
);

```

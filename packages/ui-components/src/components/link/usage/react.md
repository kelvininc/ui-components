```tsx
import React from 'react';
import { KvLink } from '@kelvininc/react-ui-components';

export const KvLinkExample: React.FC = () => (
	<>
		{/*-- Labeled --*/}
		<KvLink label={'Label here'}></KvLink>

		{/*-- Labeled with subtitle --*/}
		<KvLink label={'Label here'} subtitle={'Subtitle here'}></KvLink>

		{/*-- Labeled with subtitle and link --*/}
		<KvLink label="Your label" subtitle="Your subtitle" href="https://kelvin.ai" target="_blank"></KvLink>
	</>
);
```

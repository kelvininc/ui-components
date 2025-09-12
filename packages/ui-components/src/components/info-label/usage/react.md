```tsx
import React from 'react';

import { KvInfoLabel, KvTagLetter } from '@kelvininc/react-ui-components/client';

export const InfoLabelExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvInfoLabel labelTitle="Default" />

		{/*-- Read more and read less --*/}
		<KvInfoLabel
			labelTitle="Description"
			description="Lorem Ipsulum..."
			descriptionHeight="34"
			descriptionCollapsedText="Read more"
			descriptionOpennedText="Read less"
		/>

		{/*-- Copy values --*/}
		<KvInfoLabel
			labelTitle="TYPE"
			description="data-model"
			copyValue="data-model"
		/>

		{/*-- With component --*/}
		<KvInfoLabel labelTitle="DESCRIPTION">
			<KvTagLetter label="Test" tagLetter="T" />
		</KvInfoLabel>
	</>
);

```

```tsx
import React from 'react';
import { KvSummaryCard, ESummaryCardType } from '@kelvininc/react-ui-components/client';
export const KvSummaryCardExample: React.FC = () => (
	<>
		{/*-- Required props only (Text Type) --*/}
		<KvSummaryCard type={ESummaryCardType.Text}></KvSummaryCard>

		{/*-- Required props only (Number Type) --*/}
		<KvSummaryCard type={ESummaryCardType.Number}></KvSummaryCard>

		{/*-- Required props loading --*/}
		<KvSummaryCard type={ESummaryCardType.Text} loading></KvSummaryCard>

		{/*-- With all properties --*/}
		<KvSummaryCard
			type={ESummaryCardType.Text}
			label="Metric"
			subtitle="Mega Metric"
			description="Epic Metric">
		</KvSummaryCard>
	</>
);
```

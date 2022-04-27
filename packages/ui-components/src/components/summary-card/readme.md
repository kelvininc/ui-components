# *<kv-summary-card>*



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<-- Required props only (Text Type) -->
<kv-summary-card [type]="ESummaryCardType.Text"></kv-summary-card>

<!-- Required props only (Number Type) -->
<kv-summary-card [type]="ESummaryCardType.Number"></kv-summary-card>

<-- Required props loading -->
<kv-summary-card
	[type]="ESummaryCardType.Text"
	loading>
</kv-summary-card>

<-- With all properties -->
<kv-summary-card
	[type]="ESummaryCardType.Text"
	label="Metric"
	subtitle="Mega Metric"
	description="Epic Metric">
</kv-summary-card>
```


### React

```tsx
import React from 'react';
import { KvSummaryCard, ESummaryCardType } from '@kelvininc/react-ui-components';
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



## Properties

| Property            | Attribute     | Description                                                       | Type                                               | Default     |
| ------------------- | ------------- | ----------------------------------------------------------------- | -------------------------------------------------- | ----------- |
| `description`       | `description` | (optional) A brief description of the card's info                 | `string`                                           | `undefined` |
| `label`             | `label`       | (optional) The label to use at the top of the card                | `string`                                           | `''`        |
| `loading`           | `loading`     | (optional) Defines loading styling for this card                  | `boolean`                                          | `false`     |
| `subtitle`          | `subtitle`    | (optional) The subtitle of the card                               | `string`                                           | `undefined` |
| `type` _(required)_ | `type`        | (required) Used to define font styling according to the data type | `ESummaryCardType.Number \| ESummaryCardType.Text` | `undefined` |


----------------------------------------------



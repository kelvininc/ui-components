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

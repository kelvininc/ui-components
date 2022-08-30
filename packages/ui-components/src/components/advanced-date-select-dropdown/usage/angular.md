```html
<!-- Default -->
<kv-advanced-date-select-dropdown></kv-advanced-date-select-dropdown>

<!-- With selected absolute time -->
<kv-advanced-date-select-dropdown
	[selectedTime]="{
		type: ECalendarAdvanceTimeType.Relative,
		payload: {
			key: 'last-24-h',
			range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
		}
	}"
></kv-advanced-date-select-dropdown>

<!-- With selected relative time -->
<kv-advanced-date-select-dropdown
	[selectedTime]="{
		type: ECalendarAdvanceTimeType.Absolute,
		payload: {
			key: '2021-12-01T00:00:00Z#2021-12-05T23:59:59Z',
			range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
		}
	}"
></kv-advanced-date-select-dropdown>

<!-- With selected timezone time -->
<kv-advanced-date-select-dropdown selectedTimezone="Europe/Lisbon"></kv-advanced-date-select-dropdown>
```

```html
<!-- Default -->
<kv-advance-date-select-dropdown></kv-advance-date-select-dropdown>

<!-- With selected absolute time -->
<kv-advance-date-select-dropdown
	[selectedTime]="{
		type: ECalendarAdvanceTimeType.Relative,
		payload: {
			key: 'last-24-h',
			range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
		}
	}"
></kv-advance-date-select-dropdown>

<!-- With selected relative time -->
<kv-advance-date-select-dropdown
	[selectedTime]="{
		type: ECalendarAdvanceTimeType.Absolute,
		payload: {
			key: '2021-12-01T00:00:00Z#2021-12-05T23:59:59Z',
			range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
		}
	}"
></kv-advance-date-select-dropdown>

<!-- With selected timezone time -->
<kv-advance-date-select-dropdown selectedTimezone="Europe/Lisbon"></kv-advance-date-select-dropdown>
```

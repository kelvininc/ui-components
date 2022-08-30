```html
<!-- Default -->
<kv-calendar-advanced-date-selector></kv-calendar-advanced-date-selector>

<!-- With selected absolute time -->
<kv-calendar-advanced-date-selector
	[selectedTime]="{
		type: ECalendarAdvanceTimeType.Relative,
		payload: {
			key: 'last-24-h',
			range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
		}
	}"
></kv-calendar-advanced-date-selector>

<!-- With selected relative time -->
<kv-calendar-advanced-date-selector
	[selectedTime]="{
		type: ECalendarAdvanceTimeType.Absolute,
		payload: {
			key: '2021-12-01T00:00:00Z#2021-12-05T23:59:59Z',
			range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
		}
	}"
></kv-calendar-advanced-date-selector>

<!-- With selected timezone time -->
<kv-calendar-advanced-date-selector selectedTimezone="Europe/Lisbon"></kv-calendar-advanced-date-selector>
```

```html
<!-- Default -->
<kv-calendar-range-dates-selector></kv-calendar-range-dates-selector>

<!-- With selected ranges date -->
<kv-calendar-range-dates-selector [selectedRangeDates]="['2022-08-04', '2022-09-01']"></kv-calendar-range-dates-selector>

<!-- With initial date -->
<kv-calendar-range-dates-selector initialDate="2022-08-04"></kv-calendar-range-dates-selector>

<!-- With disabled dates-->
<kv-calendar-range-dates-selector [disabledDates]="['2021-12-01', '2021-12-04', '2021-12-05']"></kv-calendar-range-dates-selector>

<!-- With min and max date -->
<kv-calendar-range-dates-selector minDate="2021-12-04" maxDate="2023-02-12"></kv-calendar-range-dates-selector>
```

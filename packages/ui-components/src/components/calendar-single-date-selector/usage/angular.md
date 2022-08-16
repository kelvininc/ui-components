```html
<!-- Default -->
<kv-calendar-single-date-selector></kv-calendar-single-date-selector>

<!-- With selected date -->
<kv-calendar-single-date-selector selectedDate="2022-08-04"></kv-calendar-single-date-selector>

<!-- With initial date -->
<kv-calendar-single-date-selector initialDate="2022-08-04"></kv-calendar-single-date-selector>

<!-- With disabled dates-->
<kv-calendar-single-date-selector [disabledDates]="['2021-12-01', '2021-12-04', '2021-12-05']"></kv-calendar-single-date-selector>

<!-- With min and max date -->
<kv-calendar-single-date-selector minDate="2021-12-04" maxDate="2023-02-12"></kv-calendar-single-date-selector>
```

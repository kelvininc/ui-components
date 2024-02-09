```html
<!-- Default -->
<kv-absolute-time-picker-dropdown></kv-absolute-time-picker-dropdown>

<!-- With selected ranges date -->
<kv-absolute-time-picker-dropdown [selectedDates]="['2022-08-04', '2022-09-01']"></kv-absolute-time-picker-dropdown>

<!-- With initial date -->
<kv-absolute-time-picker-dropdown initialDate="2022-08-04"></kv-absolute-time-picker-dropdown>

<!-- With disabled dates-->
<kv-absolute-time-picker-dropdown [disabledDates]="['2021-12-01', '2021-12-04', '2021-12-05']"></kv-absolute-time-picker-dropdown>

<!-- With min and max date -->
<kv-absolute-time-picker-dropdown minDate="2021-12-04" maxDate="2023-02-12"></kv-absolute-time-picker-dropdown>
```

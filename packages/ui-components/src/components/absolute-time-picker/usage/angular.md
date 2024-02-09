```html
<!-- Default -->
<kv-absolute-time-picker></kv-absolute-time-picker>

<!-- With selected ranges date -->
<kv-absolute-time-picker [selectedDates]="['2022-08-04', '2022-09-01']"></kv-absolute-time-picker>

<!-- With initial date -->
<kv-absolute-time-picker initialDate="2022-08-04"></kv-absolute-time-picker>

<!-- With disabled dates-->
<kv-absolute-time-picker [disabledDates]="['2021-12-01', '2021-12-04', '2021-12-05']"></kv-absolute-time-picker>

<!-- With min and max date -->
<kv-absolute-time-picker minDate="2021-12-04" maxDate="2023-02-12"></kv-absolute-time-picker>
```

```html
<!-- Default state -->
<kv-radio-list-item
	optionId="option-1"
	label="Option 1"
	(optionClick)="onOptionClick($event)"
/>

<!-- Checked state -->
<kv-radio-list-item
	optionId="option-2"
	label="Option 2"
	[checked]="true"
	(optionClick)="onOptionClick($event)"
/>

<!-- Disabled state -->
<kv-radio-list-item
	optionId="option-3"
	label="Option 3"
	[disabled]="true"
	(optionClick)="onOptionClick($event)"
/>

<!-- With description -->
<kv-radio-list-item
	optionId="option-4"
	label="Option 4"
	description="Description for option 4"
	(optionClick)="onOptionClick($event)"
/>
```

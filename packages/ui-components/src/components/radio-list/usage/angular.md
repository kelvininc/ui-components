```html
<!-- Default -->
<kv-radio-list
	[options]="options"
	(optionSelected)="onOptionSelected($event)" />

<!-- With label -->
<kv-radio-list
	required
	label="Select an option"
	[options]="options"
	(optionSelected)="onOptionSelected($event)" />

<!-- With disabled option -->
<kv-radio-list
	[options]="optionsWithDisabled"
	[disabledOptions]="disabledOptions"
	(optionSelected)="onOptionSelected($event)" />

<!-- With selected option -->
<kv-radio-list
	[options]="options"
	[selectedOption]="option-1"
	(optionSelected)="onOptionSelected($event)" />
```

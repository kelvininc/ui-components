```html
<!-- Default -->
<kv-text-area
	maxCharLength={100}
	onTextChange="handleTextChange($event)"
	onTextBlur="handleTextBlur($event)"
/>

<!-- With Icon -->
<kv-text-area
	[icon]="EIconName.Notes"
	maxCharLength=100
	onTextChange="handleTextChange($event)"
	onTextBlur="handleTextBlur($event)"
/>

<!-- With Text -->
<kv-text-area
	[text]="text"
	maxCharLength=100
	onTextChange="handleTextChange($event)"
	onTextBlur="handleTextBlur($event)"
/>

<!-- With Text and Placeholder -->
<kv-text-area
	[text]="text"
	placeholder="Add Description"
	maxCharLength=100
	onTextChange="handleTextChange($event)"
	onTextBlur="handleTextBlur($event)"
/>
```

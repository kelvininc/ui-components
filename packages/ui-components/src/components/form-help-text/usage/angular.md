```html
<!-- Default -->
<kv-form-help-text helpText="Help text"></kv-form-help-text>

<!-- Default with array of strings-->
<kv-form-help-text [helpText]="helpTexts"></kv-form-help-text>

<!-- Default with error state -->
<kv-form-help-text helpText="Help text" [state]="EValidationState.Invalid"></kv-form-help-text>

```

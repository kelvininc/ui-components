```html
<!-- Default -->
<kv-inline-editable-header value="Node-01" />

<!-- Editing -->
<kv-inline-editable-header value="Node-01" isEditing />

<!-- With Help Text -->
<kv-inline-editable-header value="Node-01" helpText="Edit the node here" [state]="EValidationState.Invalid" isEditing />

<!-- With error -->
<kv-inline-editable-header value="Node-01" helpText="The node name already exists" [state]="EValidationState.Invalid" isEditing />
```
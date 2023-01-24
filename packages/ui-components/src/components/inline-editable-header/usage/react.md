```tsx
import React from 'react';

import { KvInlineEditableHeader, EValidationState } from '@kelvininc/react-ui-components';

export const InlineEditableHeaderExamples = () => (
	<>
		{/*-- Default */}
		<KvInlineEditableHeader value="Node-01" />

		{/*-- Editing */}
		<KvInlineEditableHeader value="Node-01" isEditing />

		{/*-- With Help Text */}
		<KvInlineEditableHeader value="Node-01" helpText="Edit the node here" state={EValidationState.None} isEditing />

		{/*-- With error */}
		<KvInlineEditableHeader value="Node-01" helpText="The node name already exists" state={EValidationState.Invalid} isEditing />
	</>
);
```

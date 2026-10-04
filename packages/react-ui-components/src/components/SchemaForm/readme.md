# _<KvSchemaForm\> _

KvSchemaForm is [React](https://reactjs.org/) component that uses [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io) to build and validate HTML forms out of a [JSON schema](http://json-schema.org/).

## RJSF 6 migration

SchemaForm uses RJSF 6.11.0. Apps that import RJSF types, validators or templates must upgrade their `@rjsf/core`, `@rjsf/utils` and `@rjsf/validator-ajv8` dependencies together to 6.11.0.

Custom array templates receive rendered React elements in `items`; render them directly with `{items}`. Item actions use `ArrayFieldItemButtonsTemplate` and its bound `onMoveUpItem`, `onMoveDownItem` and `onRemoveItem` callbacks. Custom fields use `fieldPathId` and call `onChange(value, fieldPathId.path)` to update the correct field. Templates and widgets read shared context from `registry.formContext`.

With React 19, RJSF 6.11.0's `getWidget` accepts function widgets and rejects `React.memo` and `forwardRef` widgets. Function, memo and forwardRef field templates work. See the [RJSF 6 migration guide](https://rjsf-team.github.io/react-jsonschema-form/docs/migration-guides/v6.x%20upgrade%20guide/) for the remaining consumer API changes.

## Usage

### React

```tsx
import React from 'react';

import { KvSchemaForm } from '@kelvininc/react-ui-components/client';

export const SchemaFormExample: React.FC = () => {
	const schema = {
		title: 'Contextualized errors',
		type: 'object',
		properties: {
			firstName: {
				type: 'string',
				title: 'First name',
				minLength: 8,
				pattern: '\\d+'
			},
			active: {
				type: 'boolean',
				title: 'Active'
			},
			multipleChoicesList: {
				type: 'array',
				title: 'Pick max two items',
				uniqueItems: true,
				maxItems: 2,
				items: {
					type: 'string',
					enum: ['foo', 'bar', 'fuzz']
				}
			}
		}
	};
	return (
		<KvSchemaForm<any>
			schema
			onChange={data => console.log('KvSchemaForm change', data)}
			onSubmit={data => console.log('KvSchemaForm submitted:', data)}
			onError={data => console.log('KvSchemaForm errors:', data)}
		></KvSchemaForm>
	);
};
```

## Properties:

You can use any of the properties available in the react-jsonschema-form [&lt;Form /> props](https://react-jsonschema-form.readthedocs.io/en/latest/api-reference/form-props/).

## Extra properties: 

### _allowDiscardChanges(boolean)_ 
Allow discard the changes in the form.


> **Note**: The form is always reset to the values provided in the `submittedData` property. <br/>You need update the `submittedData` property after a success submit.  

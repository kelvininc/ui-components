# _<KvSchemaForm\> _

KvSchemaForm is [React](https://reactjs.org/) component that uses [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io) to build and validate HTML forms out of a [JSON schema](http://json-schema.org/).

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

## Section layout

Object fields and homogeneous object lists render open sections. Their titles use native headings,
starting at `h2`; each titled section increases the level, up to `h6`. Blank titles and
`ui:options.label: false` suppress the heading. Custom fields, tuples and multi-selects use control layout.

Section groups use unique heading ids and link their mounted descriptions and visible errors through
`aria-describedby`. Custom title templates receive a unique `id`; the group also has a text name so a
template that omits that id still names the section. Field errors keep the existing visibility rules.

Fields have a 20px vertical gap. Object sections have dividers, and configured field widths fit the
available space. Additional-property key/value rows wrap in narrow containers, and their enabled remove
buttons participate in Tab order. The internal `data-schema-form-*` markers identify layout elements
independently of generated CSS module names.

RJSF 5 requires object schemas during path traversal. SchemaForm converts boolean property schemas to
validation-equivalent `{}` and `{not:{}}` schemas. Unconstrained properties have no inferred input type;
forbidden properties use RJSF's unsupported-field presentation. `additionalProperties` flags stay literal.

## List items

Single-value lists render one input row per item with a trash button on the right. Orderable lists
have a grip on the left that opens a Move up/Move down menu. The generated per-item labels are hidden;
`ui:itemPrefix` on the array or its items names the inputs and actions, such as "Broker 2".
Item titles supply the name when no prefix exists, with "Item" as the fallback.

Fixed tuple positions keep a visible label from their item prefix or schema title. Additional tuple
items use their prefix or title with their position number, such as "Backup 2". Fixed positions keep
RJSF's move and removal restrictions. Reserved action space keeps tuple inputs aligned.

Object items render numbered section headings and a left rail. One menu beside each heading holds
the allowed move actions and a destructive Remove action. Boundary moves stay visible and disabled.
Readonly and disabled lists keep disabled controls. Add always renders a left-aligned text button,
"Add <prefix>" or "Add item", with a plus icon.

Enabled item actions and Add participate in Tab order. Menus support mouse and keyboard interaction.
Scalar help tips stay beside the input; descriptions, errors and default helpers stay above
or below it. Custom item fields and field templates retain controls beside their content. Custom array
templates receive their own list settings. List item markup, move controls and scalar labels change in v4.

After a move, focus follows the item's menu trigger. Removing an item focuses the next item's trigger,
then the previous one, then Add. Unordered scalar lists use their Remove button. Add keeps focus while
more items are allowed; at `maxItems`, focus enters the new item's first editable control. At
`maxProperties`, Add property focuses the new key. Empty entries fall back to their item action or a
named group. These groups hold a negative Tab index only while focused.

A tuple's Add button uses the `additionalItems` prefix, then the array prefix. Kelvin's default list
templates don't render copy actions for `ui:options.copyable`; supply a custom item template to add them.
Fully replaced array and item templates manage their own action focus.

Custom widgets and fields can register their editable control for focus after an add:

```tsx
import { useSchemaFormFocusRef } from '@kelvininc/react-ui-components/client';
import type { WidgetProps } from '@rjsf/utils';

function BrokerHost({ value, onChange, disabled, readonly }: WidgetProps) {
	const focusRef = useSchemaFormFocusRef<HTMLInputElement>(disabled || readonly);
	return <input ref={focusRef} aria-label="Broker host" disabled={disabled || readonly} value={value ?? ''} onChange={event => onChange(event.target.value)} />;
}
```

Registered hosts that implement asynchronous `focusInput` or `setFocus` receive an optional
`canFocus: () => boolean` argument. Check it immediately before moving focus after any wait, so a
pending call respects the user moving elsewhere, a newer action, or the form becoming readonly.

## oneOf and anyOf

Selected branches inherit child-property settings from their parent field. Selector settings such as
title, description, help, placeholder, autofocus, widget, field, class names, disabled enum options
and template overrides stay on the parent. Set those explicitly in `uiSchema.oneOf[index]` or
`uiSchema.anyOf[index]` to apply them to a branch.

Branches hide their repeated title by default; set `ui:options.label: true` on a branch to show it.
The selector and branch use the standard field gap, with an indented rail beside the branch,
including custom branch templates. A selected object branch also gives its parent property row
and the following visible row section dividers.
Inline objects keep their existing divider-free layout.

Parent `ui:order` passes to branches with `'*'` appended for remaining properties. An explicit branch
order overrides it, including when supplied through `ui:options.order`. Arrays replace whole arrays.
Plain settings support partial overrides. An explicit `ui:emptyValue` replaces the entire inherited
JSON value, including when supplied as `undefined` or through `ui:options.emptyValue`.
SchemaForm preserves function, memo and forwardRef component references while merging UI settings,
and applies template replacements to mounted forms without modifying the caller's uiSchema.

## Properties:

You can use any of the properties available in the react-jsonschema-form [&lt;Form /> props](https://react-jsonschema-form.readthedocs.io/en/latest/api-reference/form-props/).

## Extra properties:

### _allowDiscardChanges(boolean)_

Allow discard the changes in the form.

> **Note**: The form is always reset to the values provided in the `submittedData` property. <br/>You need update the `submittedData` property after a success submit.

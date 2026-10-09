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

Object fields and object lists that don't qualify for tables render sections. Their titles use native headings,
starting at `h2`; each titled section increases the level, up to `h6`. Blank titles and
`ui:options.label: false` suppress the heading. Custom fields, tuples and multi-selects use control layout.

Section groups use unique heading ids and link their mounted descriptions and visible errors through
`aria-describedby`. Custom title templates receive a unique `id`; the group also has a text name so a
template that omits that id still names the section. Field errors keep the existing visibility rules.

List and file descriptions and default-value helpers align with the title,
before entries and their Add, Choose file or Replace file action. Helper lines have a 4px gap, followed
by 12px before entries. Collection descriptions stay visible alongside errors; entry errors and
individual input defaults remain beneath their own entry. `ui:descriptionPosition` (or `ui:options.descriptionPosition`) can set
`top`, `bottom` or `none`, including through global UI options. Text inputs, textareas and compact
multi-selects keep descriptions below the control. Custom array templates and widgets keep their layout.

Root and direct top-level section headings use 14px type with a 20px line height. The outermost
object-list entry uses the same size. Nested section and inner-entry headings use 12px type with a
16px line height. Both use weight 600 and retain their semantic heading levels.

Nested default sections move their title, fields and metadata together behind a 1px guide with 16px
inline-start padding. Root and direct top-level sections keep their page dividers; nested sections use
the ordinary field gap. Selected oneOf/anyOf branches own one guide, and a deeper object gets its own.
Untitled groups still count toward the visual structure. Guides follow the inline-start edge in RTL.

The form's available width controls indentation. Below 480px, guides use 8px padding. Each owned guide
or entry frame adds one depth. Beyond six boundaries, default guides add no inline-start padding and
default frames add no inline padding; their borders and vertical spacing remain. At 480px and above,
normal padding applies at all depths. Inner lists continue the count, and each SchemaForm starts at zero.
Explicit fieldsets and custom templates retain their own padding. Nested tables keep their independent width query.

Fields have a 20px vertical gap, and configured field widths fit the
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

Object items render numbered section headings inside a 1px outline with 4px corners and 16px padding.
Inner object lists use the same outline. Explicit fieldsets keep their existing title offset and styling.
One menu beside each heading holds
the allowed move actions and a destructive Remove action. Boundary moves stay visible and disabled.
Readonly and disabled lists keep disabled controls. Add renders a plus followed by "Add <prefix>"
or "Add item". Lists with a reserved grip column center the plus in that column and align the text
with the input. Other lists start the plus at the entry edge. List, file and radio entries have a 12px vertical gap.
Radio Clear selection actions align with the group's right edge beside descriptions, defaults or errors.
The action wraps onto its own right-aligned row when the field is too narrow to fit both columns.

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

## Flat object tables

Lists with one to four visible text, number or select properties render as tables automatically.
Nested objects, inner lists, conditional items, expandable objects, custom controls and custom layout
templates keep sections. Visible fields with suppressed labels or blank UI titles keep sections too.
Lists with visible item descriptions, item help or default-value helpers also
keep sections so their guidance stays visible. Hidden properties retain their values and don't count
toward the column limit.
Text formats such as `email`, `uri` and Kelvin's regex formats can use tables; file, date, time and color
controls keep sections. An explicit `ui:widget` qualifies only when it selects a built-in text, updown
or select widget, including their named aliases. Explicit email and URI widgets keep sections.

Headers follow the items' `ui:order`. Each header shows its title, required marker and one info tip for
the property's description or help. `descriptionPosition: 'none'` hides descriptions, including a global
setting; explicit `ui:help` still appears in the tip. Cells show their own errors below the control. Below a 480px
container, each row stacks its cells and shows small local labels with help tips. The header's help
triggers hide at this width while its column names remain available to screen readers. Resizing preserves
the controls and current focus. Table help uses labelled buttons that open and close with Enter or Space.
Header help participates in Tab order at 480px and above; stacked help sits before its cell input.

The table uses column headers and a hidden row header, such as "Variable 2". Controls receive names such
as "Name, Variable 2" through `accessibleLabel`. The row name comes from `ui:itemPrefix`, the items' title,
then "row". Tab visits each row's cell help and inputs before its reorder grip, remove button and next row.
Move, remove and Add use the focus policy described above.
The reorder and remove buttons match the first visible cell's size. Its `componentSize` overrides
`formContext.componentSize`; the default is large.

Use `layout: 'sections'` on the array to retain sections. For unordered environment variables:

```tsx
const uiSchema = {
	environment: {
		'ui:options': { layout: 'sections', itemPrefix: 'Variable', orderable: false }
	}
};
```

Omit `layout` to use the automatic table; `orderable: false` hides the grip while keeping the trash
button. `removable: false`, `addable: false`, `readonly` and `disabled` keep their existing behavior.

## oneOf and anyOf

Selected branches inherit child-property settings from their parent field. Selector settings such as
title, description, help, placeholder, autofocus, widget, field, class names, disabled enum options
and template overrides stay on the parent. Set those explicitly in `uiSchema.oneOf[index]` or
`uiSchema.anyOf[index]` to apply them to a branch.

Branches hide their repeated title by default; set `ui:options.label: true` on a branch to show it.
The selector and branch use the standard field gap, with an indented rail beside the branch,
including custom branch templates. In a root object body, a selected object branch also gives its
parent property row and the following visible row section dividers. Nested object bodies use the
ordinary field gap.
Inline objects keep their existing divider-free layout.

Parent `ui:order` passes to branches with `'*'` appended for remaining properties. An explicit branch
order overrides it, including when supplied through `ui:options.order`. Arrays replace whole arrays.
Plain settings support partial overrides. An explicit `ui:emptyValue` replaces the entire inherited
JSON value, including when supplied as `undefined` or through `ui:options.emptyValue`.
SchemaForm preserves function, memo and forwardRef component references while merging UI settings,
and applies template replacements to mounted forms without modifying the caller's uiSchema.

## Textarea values and limits

Descriptions, errors and default-value helpers share `kv-form-help-text`'s zero left inset.
Scalar-list feedback aligns with its input column, reserving the same space as the row actions.
Text and date/time inputs use the same rule for their built-in feedback. A textarea's
compact character count sits inside the bottom-right corner in a reserved footer; text scrolls
above it. `KvTextArea`'s `counter` and `counterAlwaysVisible` retain their existing visibility behavior.

Clearing a textarea commits the field's `ui:emptyValue`, including when supplied through
`ui:options.emptyValue`. The default is `undefined`. Empty strings, null and other configured values
retain their types; the form's schema still validates them. Nonempty text stays unchanged.
External empty values, "Discard changes" and "Reset to defaults" clear the displayed control.
Pinned RJSF's default `liveOmit` handling converts root-level null to `{}`; a named object field
preserves null. This follows the form's existing extra-data policy.

A textarea uses `schema.maxLength` as its default character limit. The existing top-level
`uiSchema.maxCharLength` overrides it. Positive limits count Unicode code points; an absent limit
or explicit zero allows editing without a live cap. Schema validation applies independently,
including when an override exceeds the schema limit or `schema.maxLength` is zero.
Pasting formatted clipboard content inserts plain text.
Typing and paste count the proposed value after replacing the selection, so a full field remains
editable. A replacement that would still exceed the cap stays blocked.
Programmatic values preserve line breaks and consecutive spaces in the displayed textarea.
Native text insertion and committed IME text obey the same cap. Composition drafts stay in the
browser until they finish; a rejected commit restores the previous value without emitting a change.
Caller-supplied values above the cap stay visible and can still be shortened by deletion.

## Built-in labels

SchemaForm's built-in actions, status messages and helper text use sentence case.
The error switch reads "Show all errors", the error summary reads "Errors", and additional
property inputs use `<field> key`. Single-select dropdowns use "Clear selection";
multi-select dropdowns use "Clear all". Empty dropdowns show "No data available".
Custom dropdown action labels still take precedence; blank values restore the defaults.
Field and section headings keep their uppercase typography. SchemaForm preserves
caller-supplied field names, acronyms and option labels.

## File action labels

SchemaForm labels its file picker action "Choose file" for an empty single field, "Replace file" for
a populated single field, and "Add files" for a multiple field. Stored paths and secret references
count as populated. The label follows uploads, removal, external values and form resets.

Set `fileActionLabel` in the field's `ui:options` to supply product wording or translated text:

```tsx
const uiSchema = {
	ca: {
		'ui:options': { fileActionLabel: 'Upload certificate' }
	}
};
```

Set the same key in root `ui:globalOptions` to apply it to file fields throughout the form. A field's
setting takes precedence. SchemaForm trims string overrides and uses the state-based default for
blank or non-string values. A valid override stays in effect in every state; update uiSchema when
your product needs different custom text after selection. This option controls the picker action;
file rows keep their existing Download and Remove labels.

Set `ui:options.filePreview` to `true` to show Download for decodable data URLs in both single and
multiple fields. Secret references and stored paths contain no file contents, so their rows only
offer Remove. Download stays available when the field is readonly or disabled.

File arrays keep empty and invalid entries at their original positions. Empty or non-string entries
show an Empty row with its own validation errors and Remove action. Uploading or removing another
row preserves those values until you remove them.
RJSF's defaulting and extra-data settings still apply to form values.

The accessible name combines the resolved action text and effective field title, such as
"Upload certificate: CA certificate". Untitled fields use their field id. The colon keeps the
visible text in the accessible name without adding an English connective to translated text.

## Properties:

You can use any of the properties available in the react-jsonschema-form [&lt;Form /> props](https://react-jsonschema-form.readthedocs.io/en/latest/api-reference/form-props/).

## Extra properties:

### _allowDiscardChanges(boolean)_

Allow discard the changes in the form.

> **Note**: The form is always reset to the values provided in the `submittedData` property. <br/>You need update the `submittedData` property after a success submit.

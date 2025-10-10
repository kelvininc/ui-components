# _<kv-text-field>_

<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvTextField } from '@kelvininc/react-ui-components/client';

export const TextFieldExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTextField />

		{/*-- Labeled --*/}
		<KvTextField label="Text Field" />

		{/*-- Disabled --*/}
		<KvTextField inputDisabled />
	</>
);
```



## Properties

| Property         | Attribute          | Description                                                                                   | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Default                 |
| ---------------- | ------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `actionIcon`     | `action-icon`      | (optional) Icon that is added on the right of the input. Its clickable.                       | `EIconName`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `undefined`             |
| `badge`          | `badge`            | (optional) Text to display inside a badge on the right side of the displayed value            | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`             |
| `customStyle`    | `custom-style`     | (optional) Additional style to apply for custom CSS.                                          | `{ [key: string]: string; }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `undefined`             |
| `examples`       | `examples`         | (optional) Text field example values                                                          | `string[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `undefined`             |
| `fitContent`     | `fit-content`      | (optional) Enable/disable the resize of input (default: true)                                 | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `true`                  |
| `forcedFocus`    | `forced-focus`     | (optional) Text field focus state                                                             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `helpText`       | `help-text`        | (optional) Text field help text                                                               | `string \| string[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `[]`                    |
| `hideBadge`      | `hide-badge`       | (optional) If true, the badge is not displayed                                                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `icon`           | `icon`             | (optional) Text field's icon symbol name                                                      | `EIconName`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `undefined`             |
| `inputDisabled`  | `input-disabled`   | (optional) Text field disabled                                                                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `inputMaskRegex` | `input-mask-regex` | (optional) Input mask regex                                                                   | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `''`                    |
| `inputName`      | `input-name`       | (optional) Text field input name                                                              | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`             |
| `inputReadonly`  | `input-readonly`   | (optional) Text field is readonly                                                             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `inputRequired`  | `input-required`   | (optional) Text field required                                                                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `isDirty`        | `is-dirty`         | (optional) If true, a dirty dot indicator will be added to right side of the displayed value. | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `label`          | `label`            | (optional) Text field label                                                                   | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`             |
| `loading`        | `loading`          | (optional) Text field loading state                                                           | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `max`            | `max`              | (optional) Text field maximum value                                                           | `number \| string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined`             |
| `maxLength`      | `max-length`       | (optional) Text field maximum number of characters required                                   | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`             |
| `min`            | `min`              | (optional) Text field minimum value                                                           | `number \| string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined`             |
| `minLength`      | `min-length`       | (optional) Text field minimum number of characters required                                   | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`             |
| `placeholder`    | `placeholder`      | (optional) Text field place holder                                                            | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `''`                    |
| `size`           | `size`             | (optional) Sets this tab item to a different styling configuration                            | `EComponentSize.Large \| EComponentSize.Small`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `EComponentSize.Large`  |
| `state`          | `state`            | (optional) Text field state                                                                   | `EValidationState.Invalid \| EValidationState.None \| EValidationState.Valid`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `EValidationState.None` |
| `step`           | `step`             | (optional) Text field interval between legal numbers                                          | `number \| string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined`             |
| `tooltipConfig`  | `tooltip-config`   | (optional) Text field tooltip configuration                                                   | `{ text?: string; position?: ETooltipPosition; allowedPositions?: ETooltipPosition[]; options?: Partial<{ strategy?: Strategy; placement?: Placement; middleware?: (false \| { name: string; options?: any; fn: (state: { x: number; y: number; initialPlacement: Placement; strategy: Strategy; platform: Platform; placement: Placement; middlewareData: MiddlewareData; rects: ElementRects; elements: Elements; }) => Promisable<MiddlewareReturn>; })[]; platform?: Platform; }>; disabled?: boolean; contentElement?: HTMLElement; truncate?: boolean; delay?: number; withArrow?: boolean; customStyle?: { [key: string]: string; }; customClass?: CustomCssClass; }` | `undefined`             |
| `type`           | `type`             | (optional) Text field type                                                                    | `EInputFieldType.Date \| EInputFieldType.DateTime \| EInputFieldType.Email \| EInputFieldType.Number \| EInputFieldType.Password \| EInputFieldType.Radio \| EInputFieldType.Text`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `EInputFieldType.Text`  |
| `useInputMask`   | `use-input-mask`   | (optional) Use a input mask when the text field type is number (default true)                 | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `undefined`             |
| `value`          | `value`            | (optional) Text field value                                                                   | `number \| string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `''`                    |
| `valuePrefix`    | `value-prefix`     | (optional) Defines the prefix that adds context to displayed values                           | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`             |


## Events

| Event              | Description                                  | Type                      |
| ------------------ | -------------------------------------------- | ------------------------- |
| `fieldClick`       | Emmited when there's a click on this element | `CustomEvent<MouseEvent>` |
| `rightActionClick` | Emitted when the right icon is clicked       | `CustomEvent<MouseEvent>` |
| `textChange`       | Emitted when a keyboard input occurred       | `CustomEvent<string>`     |
| `textFieldBlur`    | Emitted when text field lost focus           | `CustomEvent<string>`     |


## Methods

### `focusInput() => Promise<void>`

Focuses the input

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part                | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `"badge"`           | badge rendered at the right of the text field          |
| `"input-container"` | container that includes the input, right and left slot |


## CSS Custom Properties

| Name                                | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| `--background-color-default`        | Background color when state is default.        |
| `--background-color-default`        | Background color when state is default.        |
| `--background-color-disabled`       | Background color when state is disabled.       |
| `--background-color-disabled`       | Background color when state is disabled.       |
| `--border-color-default`            | Border color when state is default.            |
| `--border-color-default`            | Border color when state is default.            |
| `--border-color-error`              | Border color when state is invalid.            |
| `--border-color-error`              | Border color when state is invalid.            |
| `--border-color-focused`            | Border color when state is focused.            |
| `--border-color-focused`            | Border color when state is focused.            |
| `--input-height-large`              | Text Field's large height.                     |
| `--input-height-large`              | Text Field's large height.                     |
| `--input-height-small`              | Text Field's small height.                     |
| `--input-height-small`              | Text Field's small height.                     |
| `--input-max-width`                 | Text Field's max width.                        |
| `--input-max-width`                 | Text Field's max width.                        |
| `--input-min-width`                 | Text Field's min width.                        |
| `--input-min-width`                 | Text Field's min width.                        |
| `--input-width`                     | Text Field's width.                            |
| `--input-width`                     | Text Field's width.                            |
| `--text-color-action-icon-default`  | Action icon color when state is default.       |
| `--text-color-action-icon-default`  | Action icon color when state is default.       |
| `--text-color-action-icon-disabled` | Action icon color when state is disabled.      |
| `--text-color-action-icon-disabled` | Action icon color when state is disabled.      |
| `--text-color-action-icon-focused`  | Action icon color when state is focused.       |
| `--text-color-action-icon-focused`  | Action icon color when state is focused.       |
| `--text-color-help-text-default`    | Help Text color when state is default.         |
| `--text-color-help-text-default`    | Help Text color when state is default.         |
| `--text-color-help-text-error`      | Help Text color when state is invalid.         |
| `--text-color-help-text-error`      | Help Text color when state is invalid.         |
| `--text-color-icon-default`         | Icon color when state is default.              |
| `--text-color-icon-default`         | Icon color when state is default.              |
| `--text-color-icon-disabled`        | Icon color when state is disabled.             |
| `--text-color-icon-disabled`        | Icon color when state is disabled.             |
| `--text-color-icon-focused`         | Icon color when state is focused.              |
| `--text-color-icon-focused`         | Icon color when state is focused.              |
| `--text-color-input-default`        | Input text color when state is default.        |
| `--text-color-input-default`        | Input text color when state is default.        |
| `--text-color-input-disabled`       | Input text color when state is disabled.       |
| `--text-color-input-disabled`       | Input text color when state is disabled.       |
| `--text-color-input-focused`        | Input Text color when state is focused.        |
| `--text-color-input-focused`        | Input Text color when state is focused.        |
| `--text-color-label`                | Label Text color.                              |
| `--text-color-label`                | Label Text color.                              |
| `--text-color-placeholder-default`  | Placeholder text color when state is default.  |
| `--text-color-placeholder-default`  | Placeholder text color when state is default.  |
| `--text-color-placeholder-disabled` | Placeholder text color when state is disabled. |
| `--text-color-placeholder-disabled` | Placeholder text color when state is disabled. |
| `--text-color-placeholder-focused`  | Placeholder text color when state is focused.  |
| `--text-color-placeholder-focused`  | Placeholder text color when state is focused.  |


## Dependencies

### Used by

 - [kv-dropdown](../dropdown)
 - [kv-search](../search)
 - [kv-select-create-option](../select-create-option)

### Depends on

- [kv-tooltip](../tooltip)
- [kv-form-label](../form-label)
- [kv-icon](../icon)
- [kv-dirty-dot](../dirty-dot)
- [kv-badge](../badge)
- [kv-form-help-text](../form-help-text)

### Graph
```mermaid
graph TD;
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-dirty-dot
  kv-text-field --> kv-badge
  kv-text-field --> kv-form-help-text
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-dirty-dot --> kv-icon
  kv-form-help-text --> kv-icon
  kv-dropdown --> kv-text-field
  kv-search --> kv-text-field
  kv-select-create-option --> kv-text-field
  style kv-text-field fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------



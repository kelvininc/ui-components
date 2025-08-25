# _<kv-tooltip>_

<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvTooltip, KvActionButton, ETooltipPosition, EActionButtonType } from '@kelvininc/react-ui-components';

export const TooltipExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvTooltip text="Tooltip">
		<KvActionButton type={EActionButtonType.Primary}>Hover me!</KvActionButton>
	</KvTooltip>

	{/*-- With Fixed Position --*/}
	<KvTooltip text="Tooltip" position={ETooltipPosition.Left}>
		<KvActionButton type={EActionButtonType.Primary}>Hover me!</KvActionButton>
	</KvTooltip>

	{/*-- With Allowed Positions --*/}
	<KvTooltip text="Tooltip" allowedPositions={[ETooltipPosition.Top, ETooltipPosition.Bottom]}>
		<KvActionButton type={EActionButtonType.Primary}>Hover me!</KvActionButton>
	</KvTooltip>
  </>
);
```



## Properties

| Property           | Attribute           | Description                                                                                                                                                                             | Type                                                                                                                                                                                                                                                                                                                                                                           | Default                   |
| ------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `allowedPositions` | `allowed-positions` | (optional) Array of allowed positions of toggle tip (if defined the 'position' is ignored)                                                                                              | `ETooltipPosition[]`                                                                                                                                                                                                                                                                                                                                                           | `undefined`               |
| `contentElement`   | `content-element`   | (optional) Content element reference                                                                                                                                                    | `HTMLElement`                                                                                                                                                                                                                                                                                                                                                                  | `null`                    |
| `customClass`      | `custom-class`      | (optional) Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. It is also valid to provide CssClassMap with boolean logic. | `CssClassMap \| string \| string[]`                                                                                                                                                                                                                                                                                                                                            | `''`                      |
| `customStyle`      | `custom-style`      | (optional) Additional style to apply for custom CSS.                                                                                                                                    | `{ [key: string]: string; }`                                                                                                                                                                                                                                                                                                                                                   | `undefined`               |
| `delay`            | `delay`             | (optional) Delay to show tooltip in milliseconds.                                                                                                                                       | `number`                                                                                                                                                                                                                                                                                                                                                                       | `DEFAULT_DELAY_CONFIG`    |
| `disabled`         | `disabled`          | (optional) Disables tooltip                                                                                                                                                             | `boolean`                                                                                                                                                                                                                                                                                                                                                                      | `false`                   |
| `options`          | `options`           | (optional) Object with tooltip position options                                                                                                                                         | `{ strategy?: Strategy; placement?: Placement; middleware?: (false \| { name: string; options?: any; fn: (state: { x: number; y: number; initialPlacement: Placement; strategy: Strategy; platform: Platform; placement: Placement; middlewareData: MiddlewareData; rects: ElementRects; elements: Elements; }) => Promisable<MiddlewareReturn>; })[]; platform?: Platform; }` | `DEFAULT_POSITION_CONFIG` |
| `position`         | `position`          | (optional) Position of tooltip                                                                                                                                                          | `ETooltipPosition.Bottom \| ETooltipPosition.BottomEnd \| ETooltipPosition.BottomStart \| ETooltipPosition.Left \| ETooltipPosition.LeftEnd \| ETooltipPosition.LeftStart \| ETooltipPosition.Right \| ETooltipPosition.RightEnd \| ETooltipPosition.RightStart \| ETooltipPosition.Top \| ETooltipPosition.TopEnd \| ETooltipPosition.TopStart`                               | `undefined`               |
| `text`             | `text`              | (optional) Text of tooltip                                                                                                                                                              | `string`                                                                                                                                                                                                                                                                                                                                                                       | `''`                      |
| `truncate`         | `truncate`          | (optional) Set `true` to display tooltip only when the content is truncated                                                                                                             | `boolean`                                                                                                                                                                                                                                                                                                                                                                      | `false`                   |
| `withArrow`        | `with-arrow`        | (optional) if true it will render an arrow pointing to the opening element (default false)                                                                                              | `boolean`                                                                                                                                                                                                                                                                                                                                                                      | `false`                   |


## Shadow Parts

| Part        | Description          |
| ----------- | -------------------- |
| `"content"` | The tooltip content. |


## Dependencies

### Used by

 - [kv-copy-to-clipboard](../copy-to-clipboard)
 - [kv-description-list](../description-list)
 - [kv-info-label](../info-label)
 - [kv-select-multi-options](../select-multi-options)
 - [kv-select-option](../select-option)
 - [kv-text-field](../text-field)
 - [kv-time-picker](../time-picker)
 - [kv-toggle-button](../toggle-button)
 - [kv-tree-item](../tree-item)
 - [kv-wizard-footer](../wizard-footer)

### Depends on

- [kv-portal](../portal)
- [kv-tooltip-text](../tooltip-text)

### Graph
```mermaid
graph TD;
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-copy-to-clipboard --> kv-tooltip
  kv-description-list --> kv-tooltip
  kv-info-label --> kv-tooltip
  kv-select-multi-options --> kv-tooltip
  kv-select-option --> kv-tooltip
  kv-text-field --> kv-tooltip
  kv-time-picker --> kv-tooltip
  kv-toggle-button --> kv-tooltip
  kv-tree-item --> kv-tooltip
  kv-wizard-footer --> kv-tooltip
  style kv-tooltip fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------



# _<kv-badge>_

<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvBadge, EBadgeState } from '@kelvininc/react-ui-components/client';

export const BadgeExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvBadge>Badge</KvBadge>

		{/*-- Info --*/}
		<KvBadge state={EBadgeState.Info}>Info Badge</KvBadge>

		{/*-- Warning --*/}
		<KvBadge state={EBadgeState.Warning}>Warning Badge</KvBadge>

		{/*-- Error --*/}
		<KvBadge state={EBadgeState.Error}>Error Badge</KvBadge>

		{/*-- Success --*/}
		<KvBadge state={EBadgeState.Success}>Success Badge</KvBadge>
	</>x
);
```



## Properties

| Property   | Attribute  | Description                                          | Type                                         | Default              |
| ---------- | ---------- | ---------------------------------------------------- | -------------------------------------------- | -------------------- |
| `disabled` | `disabled` | (optional) If `true` the badge is in disabled state. | `boolean`                                    | `false`              |
| `type`     | `type`     | (optional) Defines the badge type.                   | `EBadgeType.Primary \| EBadgeType.Secondary` | `EBadgeType.Primary` |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"badge"` | The badge.  |


## CSS Custom Properties

| Name                                 | Description                                      |
| ------------------------------------ | ------------------------------------------------ |
| `--badge-background-color-primary`   | Badge's background color when type is primary.   |
| `--badge-background-color-secondary` | Badge's background color when type is secondary. |
| `--badge-height`                     | Badge's height.                                  |
| `--badge-max-width`                  | Badge's maximum width.                           |
| `--badge-min-width`                  | Badge's minimum width.                           |
| `--badge-text-color-primary`         | Badge's text color when type is primary.         |
| `--badge-text-color-secondary`       | Badge's text color when type is secondary.       |
| `--badge-width`                      | Badge's width.                                   |


## Dependencies

### Used by

 - [kv-tab-navigation](../tab-navigation)
 - [kv-tag](../tag)
 - [kv-text-field](../text-field)

### Graph
```mermaid
graph TD;
  kv-tab-navigation --> kv-badge
  kv-tag --> kv-badge
  kv-text-field --> kv-badge
  style kv-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------



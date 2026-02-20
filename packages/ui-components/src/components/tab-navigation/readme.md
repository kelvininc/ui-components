# kv-tab-navigation



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';
import { KvTabNavigation } from '@kelvininc/react-ui-components/client';

export const TabNavigationExample: React.FC = () => (
	<>
		{/*-- With required props --*/}
		<KvTabNavigation tabs={myNavigationTabs} selectedTabKey="tab1"></KvTabNavigation>

		{/*-- With required props and notification --*/}
		<KvTabNavigation
			tabs={myNavigationTabs}
			selectedTabKey="tab1"
			notifications={myNavigationTabsNotifications}>
		</KvTabNavigation>
	</>
);
```



## Properties

| Property         | Attribute          | Description                                              | Type                                             | Default                |
| ---------------- | ------------------ | -------------------------------------------------------- | ------------------------------------------------ | ---------------------- |
| `selectedTabKey` | `selected-tab-key` | (optional) The currently selected tab key                | `number \| string`                               | `undefined`            |
| `tabs`           | `tabs`             | (required) The tab items to render in this component     | `ITabNavigationItem[]`                           | `[]`                   |
| `type`           | `type`             | (optional) Sets the visual variant of the tab navigation | `ETabItemType.Primary \| ETabItemType.Secondary` | `ETabItemType.Primary` |


## Events

| Event       | Description                                                  | Type                  |
| ----------- | ------------------------------------------------------------ | --------------------- |
| `tabChange` | When the tab selection changes, emit the requested tab's key | `CustomEvent<string>` |


## CSS Custom Properties

| Name                         | Description                  |
| ---------------------------- | ---------------------------- |
| `--tab-list-bg-color`        | Background color of the list |
| `--tab-list-divider-color`   | Tab divider bar color        |
| `--tab-list-indicator-color` | Tab indicator bar color      |


## Dependencies

### Depends on

- [kv-tab-item](../tab-item)
- [kv-badge](../badge)
- [kv-tag-status](../tag-status)

### Graph
```mermaid
graph TD;
  kv-tab-navigation --> kv-tab-item
  kv-tab-navigation --> kv-badge
  kv-tab-navigation --> kv-tag-status
  kv-tag-status --> kv-icon
  style kv-tab-navigation fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------



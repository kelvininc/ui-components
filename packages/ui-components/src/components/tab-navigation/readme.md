# kv-tab-navigation



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';
import { KvTabNavigation } from '@kelvininc/react-ui-components';

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

| Property         | Attribute          | Description                                                                     | Type                                           | Default                |
| ---------------- | ------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------- |
| `notifications`  | `notifications`    | (optional) To add a notification dot and its respective color to a specific tab | `ITabsNotificationDict`                        | `{}`                   |
| `selectedTabKey` | `selected-tab-key` | (optional) The currently selected tab key                                       | `number \| string`                             | `undefined`            |
| `size`           | `size`             | (optional) Sets the items on this tab nav to use small styling configuration    | `EComponentSize.Large \| EComponentSize.Small` | `EComponentSize.Large` |
| `tabs`           | `tabs`             | (required) The tab items to render in this component                            | `ITabNavigationItem[]`                         | `[]`                   |


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

### Graph
```mermaid
graph TD;
  kv-tab-navigation --> kv-tab-item
  kv-tab-item --> kv-icon
  style kv-tab-navigation fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------



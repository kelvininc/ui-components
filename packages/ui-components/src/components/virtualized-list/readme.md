# _<kv-virtualized-list>_

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                         | Type                                                                                                                | Default     |
| --------------- | ---------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| `getItemKey`    | `get-item-key`   | (required) Defines the given item key                                               | `(index: number) => string`                                                                                         | `undefined` |
| `itemCount`     | `item-count`     | (required) Defines the total number of items rendered in the list                   | `number`                                                                                                            | `undefined` |
| `itemHeight`    | `item-height`    | (required) Defines the estimated height in pixels of an item                        | `number`                                                                                                            | `undefined` |
| `overscanCount` | `overscan-count` | (optional) The number of items outside the viewport that are rendered. Default: `5` | `number`                                                                                                            | `5`         |
| `renderItem`    | `render-item`    | (required) Defines the item render function                                         | `(index: number) => ChildType \| Promise<ChildType> \| ChildType[] \| Promise<ChildType[]> \| Promise<ChildType>[]` | `undefined` |


## CSS Custom Properties

| Name                            | Description                           |
| ------------------------------- | ------------------------------------- |
| `--virtualized-list-max-height` | Virtualized list maximum height.      |
| `--virtualized-list-min-height` | Virtualized list list minimum height. |


## Dependencies

### Used by

 - [kv-select-multi-options](../select-multi-options)

### Graph
```mermaid
graph TD;
  kv-select-multi-options --> kv-virtualized-list
  style kv-virtualized-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------



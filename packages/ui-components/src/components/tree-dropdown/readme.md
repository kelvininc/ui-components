# kv-dropdown-tree



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute       | Description                                                                                                                             | Type                          | Default     |
| -------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| `disabledNodes`      | --              | (optional) Dictionary that defines whether the tree node is disabled.                                                                   | `{ [key: string]: boolean; }` | `undefined` |
| `expandedNodes`      | --              | (optional) Dictionary that defines whether the tree node is expanded or collapsed. Only has visual effect for tree nodes with children. | `{ [key: string]: boolean; }` | `undefined` |
| `hiddenNodes`        | --              | (optional) Dictionary that defines whether the tree node is hidden.                                                                     | `{ [key: string]: boolean; }` | `undefined` |
| `loading`            | `loading`       | (optional) Defines whether the all tree nodes is loading.                                                                               | `boolean`                     | `false`     |
| `loadingNodes`       | --              | (optional) Dictionary that defines whether the tree node is loading.                                                                    | `{ [key: string]: boolean; }` | `undefined` |
| `nodes` _(required)_ | --              | (required) The tree hierarchy items to render in this component                                                                         | `ITreeNodeItem[]`             | `undefined` |
| `selectedNode`       | `selected-node` | (optional) The currently selected node id                                                                                               | `string`                      | `undefined` |


## Events

| Event              | Description                                    | Type                         |
| ------------------ | ---------------------------------------------- | ---------------------------- |
| `nodeClick`        | Emitted when the tree node item is clicked     | `CustomEvent<ITreeNodeItem>` |
| `nodeToggleExpand` | Emitted when the node expand toggle is clicked | `CustomEvent<ITreeNodeItem>` |


## CSS Custom Properties

| Name                         | Description                        |
| ---------------------------- | ---------------------------------- |
| `--dropdown-children-offset` | Offset of the child nodes in px.   |
| `--dropdown-node-gap`        | Gap between child nodes in px.     |
| `--dropdown-padding-left`    | Left padding of option text in px. |
| `--dropdown-width`           | Container width in px;             |


## Dependencies

### Depends on

- [kv-tree](../tree)

### Graph
```mermaid
graph TD;
  kv-tree-dropdown --> kv-tree
  kv-tree --> kv-tree-item
  kv-tree-item --> kv-icon
  kv-tree-item --> kv-badge
  style kv-tree-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------



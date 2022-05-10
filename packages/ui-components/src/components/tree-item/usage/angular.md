```html
<!-- Default -->
<kv-tree-item label="Node name"></kv-tree-item>

<!-- Disabled -->
<kv-tree-item label="Node name" disabled></kv-tree-item>

<!-- Selected -->
<kv-tree-item label="Node name" selected></kv-tree-item>

<!-- Highlighted -->
<kv-tree-item label="Node name" highlighted></kv-tree-item>

<!-- No Filled -->
<kv-tree-item placeholder="Placeholder"></kv-tree-item>

<!-- With Icon -->
<kv-tree-item label="Node name" [icon]="EIconName.AssetA"></kv-tree-item>

<!-- With Counter State -->
<kv-tree-item label="Node name" counter="32" [counterState]="ETreeItemState.Success"></kv-tree-item>

<!-- With Children -->
<kv-tree-item label="Parent Node">
	<kv-tree-item label="Node 1" slot="child-slot">
		<kv-tree-item label="Node 1.1" slot="child-slot"></kv-tree-item>
		<kv-tree-item label="Node 1.2" slot="child-slot"></kv-tree-item>
	</kv-tree-item>
	<kv-tree-item label="Node 2" slot="child-slot"></kv-tree-item>
	<kv-tree-item label="Node 3" slot="child-slot"></kv-tree-item>
</kv-tree-item>
```

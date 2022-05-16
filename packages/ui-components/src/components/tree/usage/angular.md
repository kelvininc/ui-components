```html
<!-- With required props -->
<kv-tree [nodes]="myTreeNodes"></kv-tree>

<!-- With required props and all tree loading -->
<kv-tree [nodes]="myTreeNodes" loading></kv-tree>

<!-- With required props and selected node -->
<kv-tree [nodes]="myTreeNodes" selectedNode="node-id"></kv-tree>

<!-- With required props and hidden nodes dictionary -->
<kv-tree
	[nodes]="myTreeNodes"
	[hiddenNodes]="myHiddenNodes">
</kv-tree>

<!-- With required props and expanded nodes dictionary -->
<kv-tree
	[nodes]="myTreeNodes"
	[expandedNodes]="myExpandedNodes">
</kv-tree>

<!-- With required props and disabled nodes dictionary -->
<kv-tree
	[nodes]="myTreeNodes"
	[disabledNodes]="myDisabledNodes">
</kv-tree>

<!-- With required props and highlighted nodes dictionary -->
<kv-tree
	[nodes]="myTreeNodes"
	[highlightedNodes]="myHighlightedNodes">
</kv-tree>

<!-- With required props and loading nodes dictionary -->
<kv-tree
	[nodes]="myTreeNodes"
	[loadingNodes]="myLoadingNodes">
</kv-tree>
```

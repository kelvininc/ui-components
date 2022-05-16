```tsx
import React from 'react';
import { KvTreeItem } from '@kelvininc/react-ui-components';

export const TreeItemExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTreeItem label="Node name"></KvTreeItem>

		{/*-- Disabled --*/}
		<KvTreeItem label="Node name" disabled></KvTreeItem>

		{/*-- Selected --*/}
		<KvTreeItem label="Node name" selected></KvTreeItem>

		{/*-- Highlighted --*/}
		<KvTreeItem label="Node name" highlighted></KvTreeItem>

		{/*-- No Filled --*/}
		<KvTreeItem placeholder="Placeholder"></KvTreeItem>

		{/*-- With Icon --*/}
		<KvTreeItem label="Node name" icon={EIconName.AssetA}></KvTreeItem>

		{/*-- With Counter State --*/}
		<KvTreeItem label="Node name" counter="32" counterState={ETreeItemState.Success}></KvTreeItem>

		{/*-- With Children --*/}
		<KvTreeItem label="Parent Node">
			<KvTreeItem label="Node 1" slot="child-slot">
				<KvTreeItem label="Node 1.1" slot="child-slot"></KvTreeItem>
				<KvTreeItem label="Node 1.2" slot="child-slot"></KvTreeItem>
			</KvTreeItem>
			<KvTreeItem label="Node 2" slot="child-slot"></KvTreeItem>
			<KvTreeItem label="Node 3" slot="child-slot"></KvTreeItem>
		</KvTreeItem>
	</>
);
```

# KvActionMenu

An icon button that opens a menu of actions.

```tsx
import React, { useRef } from 'react';
import { EIconName, IActionMenuHandle, KvActionMenu } from '@kelvininc/react-ui-components/client';

export const TopicActions: React.FC<{ onAction: (id: string) => void }> = ({ onAction }) => {
	const menuRef = useRef<IActionMenuHandle>(null);

	return (
		<KvActionMenu
			ref={menuRef}
			accessibleLabel="Topic 1 actions"
			icon={EIconName.More}
			items={[
				{ id: 'move-up', label: 'Move up', icon: EIconName.ArrowUpward, disabled: true },
				{ id: 'move-down', label: 'Move down', icon: EIconName.ArrowDownward },
				{ id: 'remove', label: 'Remove Topic 1', icon: EIconName.Delete, destructive: true, separatorBefore: true }
			]}
			onItemSelected={onAction}
		/>
	);
};
```

Item ids must be unique within the menu. The menu returns focus to its trigger before it calls `onItemSelected` with the action's id, so your handler can choose another focus destination.

Call `await menuRef.current.setFocus()` to focus the trigger; it resolves `true` once the trigger has focus. `triggerTabIndex={-1}` removes the trigger from sequential Tab navigation while keeping `setFocus()` available. A disabled menu keeps its trigger out of Tab order and ignores `setFocus()`.

Enter, Space and ArrowDown open the menu on the first enabled action. ArrowUp and ArrowDown wrap around the enabled actions, and Home and End move to the ends. Escape returns to the trigger. Tab and Shift+Tab close the menu and move to the adjacent field. Empty and all-disabled menus focus their named container.

The open panel lives in a body portal, like every `kv-dropdown-base` list. A row that moves keeps its menu, which can reopen.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `accessibleLabel` | `string` | | Required. Names the trigger and its menu |
| `items` | `readonly IActionMenuItem[]` | `[]` | Actions in display order |
| `icon` | `EIconName` | `EIconName.More` | Trigger icon |
| `disabled` | `boolean` | `false` | Disables the trigger and closes the menu |
| `size` | `EComponentSize` | `EComponentSize.Small` | Trigger size |
| `triggerTabIndex` | `number` | | Trigger Tab index |
| `className` | `string` | | Class on the element that wraps the trigger |
| `onItemSelected` | `(id: string) => void` | | Called with the selected action's id |

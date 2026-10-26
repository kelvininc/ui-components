```tsx
import React from 'react';
import { EIconName, KvActionMenu } from '@kelvininc/react-ui-components/client';

export const TopicActions: React.FC<{ onAction: (id: string) => void }> = ({ onAction }) => (
	<KvActionMenu
		accessibleLabel="Topic 1 actions"
		icon={EIconName.More}
		items={[
			{ id: 'move-up', label: 'Move up', icon: EIconName.ArrowUpward, disabled: true },
			{ id: 'move-down', label: 'Move down', icon: EIconName.ArrowDownward },
			{ id: 'remove', label: 'Remove Topic 1', icon: EIconName.Delete, destructive: true, separatorBefore: true }
		]}
		onItemSelected={event => onAction(event.detail)}
	/>
);
```

Item ids must be unique within the menu. The menu returns focus to its trigger before it emits `itemSelected`, so your handler can choose another focus destination.

Use a ref and call `await ref.current.setFocus()` to focus the trigger. `triggerTabIndex={-1}` removes it from sequential Tab navigation while keeping explicit focus available. A disabled menu keeps its trigger out of Tab order and ignores `setFocus()`.

Moving a mounted row closes its menu and recreates the panel. The same menu ref can reopen it; `setFocus()` waits for the replacement trigger to render.

Enter, Space and ArrowDown open on the first enabled item. ArrowUp/ArrowDown wrap around enabled items; Home/End move to the ends. Escape returns to the trigger. Tab/Shift+Tab close and move to the adjacent field. Empty and all-disabled menus focus their named container.

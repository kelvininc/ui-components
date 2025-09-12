```tsx
import React from 'react';
import { ModalOverlay, useModal } from '@kelvininc/react-ui-components/client';
import type { ModalOverlayProps } from '@kelvininc/react-ui-components/client';

export const ModalOverlayExample: React.FC = (args: ModalOverlayProps) => {
	const modalController = useModal(args.isOpen);

	return (
		<>
			<button type="button" onClick={modalController.open}>
				Open Modal
			</button>
			<ModalOverlay rootId="root" {...args} isOpen={modalCtrl.isOpen} />
		</>
	);
};
```

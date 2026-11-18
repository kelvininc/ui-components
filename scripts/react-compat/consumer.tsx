import type { ComponentProps } from 'react';
import {
	ModalOverlay,
	KvSchemaForm,
	useModal
} from '@kelvininc/react-ui-components/client';
import type * as Shared from '@kelvininc/react-ui-components/shared';
import type * as Server from '@kelvininc/react-ui-components/server';

/** Exercise authored component props and hook returns with the selected consumer types. */
export const Consumer = () => {
	const modal = useModal(false);
	const props: ComponentProps<typeof ModalOverlay> = { isOpen: modal.isOpen };
	const formProps: ComponentProps<typeof KvSchemaForm> = {
		schema: { type: 'object' }
	};
	return (
		<>
			<ModalOverlay {...props} />
			<KvSchemaForm {...formProps} />
		</>
	);
};

/** Force both declaration entry points to resolve in the consumer project. */
export type PublicEntries = [typeof Shared, typeof Server];

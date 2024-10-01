import React, { PropsWithChildren, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { JSX } from '@kelvininc/ui-components';

import { IModalController } from './types';
import { DEFAULT_MODAL_ROOT_ID } from './config';

import { KvModal } from '../../stencil-generated/components';

export type ModalOverlayProps = {
	rootId?: string;
	isOpen: boolean;
} & PropsWithChildren<JSX.KvModal>;

export function useModal(initialState = false): IModalController {
	const [isOpen, setOpen] = useState(initialState);

	const open = useCallback(() => setOpen(true), []);
	const close = useCallback(() => setOpen(false), []);

	return {
		isOpen,
		open,
		close
	};
}

export function ModalOverlay({ rootId = DEFAULT_MODAL_ROOT_ID, isOpen, ...otherProps }: ModalOverlayProps) {
	if (!isOpen) {
		return null;
	}

	return ReactDOM.createPortal(<KvModal {...otherProps} />, document.getElementById(rootId) as Element);
}

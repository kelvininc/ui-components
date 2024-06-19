import React, { PropsWithChildren, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import type { IToaster, JSX } from '@kelvininc/ui-components';

import { KvToaster } from '../stencil-generated';
import { DEFAULT_ROOT_ID, DEFAULT_TOASTER_TTL } from './config';

export type ToasterContainerProps = {
	rootId?: string;
	isOpen: boolean;
} & JSX.KvToaster;

export interface IToasterController {
	isOpen: boolean;
	config: IToaster;
	openToaster: (newConfig: IToaster) => void;
	closeToaster: () => void;
}

export function useToaster(initialConfig: IToaster, initialState = false): IToasterController {
	const [config, setConfig] = useState<IToaster>(initialConfig);
	const [isOpen, setOpen] = useState(initialState);

	const openToaster = useCallback((newConfig: IToaster) => {
		setOpen(true);
		setConfig(newConfig);
	}, []);

	const closeToaster = useCallback(() => {
		setOpen(false);
		setConfig(initialConfig);
	}, [initialConfig]);

	return {
		isOpen,
		openToaster,
		closeToaster,
		config
	};
}

export function ToasterContainer({ rootId = DEFAULT_ROOT_ID, isOpen, children, ...otherProps }: PropsWithChildren<ToasterContainerProps>) {
	if (!isOpen) {
		return null;
	}

	return ReactDOM.createPortal(
		<KvToaster ttl={DEFAULT_TOASTER_TTL} {...otherProps}>
			{children}
		</KvToaster>,
		document.getElementById(rootId) as Element
	);
}

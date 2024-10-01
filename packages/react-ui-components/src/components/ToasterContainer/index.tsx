import React, { PropsWithChildren, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import type { IToaster, JSX } from '@kelvininc/ui-components';

import { KvToaster } from '../../stencil-generated/components';
import { DEFAULT_ROOT_ID, TOASTER_CONFIG } from './config';

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

export function useToaster(initialConfig: IToaster = TOASTER_CONFIG, initialState = false): IToasterController {
	const [config, setConfig] = useState<IToaster>(initialConfig);
	const [isOpen, setOpen] = useState(initialState);

	const openToaster = useCallback(
		(newConfig: IToaster) => {
			setOpen(true);
			setConfig({ ...initialConfig, ...newConfig });
		},
		[initialConfig]
	);

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

	return ReactDOM.createPortal(<KvToaster {...otherProps}>{children}</KvToaster>, document.getElementById(rootId) as Element);
}

import React from 'react';
import ReactDOM from 'react-dom';
import type { JSX } from '@kelvininc/ui-components';

import { KvToaster } from '../stencil-generated';
import { DEFAULT_ROOT_ID } from './config';

type ToasterContainerProps = {
	rootId?: string;
	isOpen: boolean;
} & JSX.KvToaster;

function ToasterContainer({ rootId = DEFAULT_ROOT_ID, isOpen, ...otherProps }: ToasterContainerProps) {
	return isOpen && ReactDOM.createPortal(<KvToaster {...otherProps} />, document.getElementById(rootId) as Element);
}

export default ToasterContainer;

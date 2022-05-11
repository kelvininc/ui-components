import React from 'react';
import ReactDOM from 'react-dom';
import { IToaster } from '@kelvininc/ui-components';

import { KvToaster } from '../stencil-generated';
import { DEFAULT_ROOT_ID } from './config';

type ToasterContainerProps = {
	rootId?: string;
} & IToaster;

function ToasterContainer({ rootId = DEFAULT_ROOT_ID, ...otherProps }: ToasterContainerProps) {
	return ReactDOM.createPortal(<KvToaster {...otherProps} />, document.getElementById(rootId) as Element);
}

export default ToasterContainer;

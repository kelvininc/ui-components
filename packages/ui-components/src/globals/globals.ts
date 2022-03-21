import { setMode } from '@stencil/core';
import { get } from 'lodash-es';
import { StyleMode, UIComponentsConfig } from '../types';
import { DEFAULT_CONFIG } from './config';

export const initialize = (userConfig: UIComponentsConfig = {}) => {
	const defaultStyleMode = get(userConfig, 'styleMode', StyleMode.Night);

	const { document: doc, window: win } = window;

	doc.body.setAttribute('mode', defaultStyleMode);

	const isKvElement = (elm: any) => elm.tagName && elm.tagName.startsWith('KV-');
	const isAllowedStyleModeValue = (elmMode: StyleMode) => Object.values(StyleMode).includes(elmMode);

	setMode((elm: any) => {
		while (elm) {
			const elmMode = (elm as any).mode || elm.getAttribute('mode');
			if (elmMode) {
				if (isAllowedStyleModeValue(elmMode)) {
					return elmMode;
				} else if (isKvElement(elm)) {
					console.warn(`Invalid kv-component mode: ${elmMode}, expected: ${Object.values(StyleMode).join(',')}`);
				}
			}
			// TODO: check with more time why cant obtain the parentElement
			// elm = elm.parentElement;
			elm = doc.body;
		}
		return defaultStyleMode;
	});

	if (typeof win === 'undefined') {
		return;
	}

	const instance = (win.KvUiComponents = win.KvUiComponents ?? {});
	const actualConfig = (instance.config = instance.config ?? {});
	win.KvUiComponents.config = {
		...DEFAULT_CONFIG,
		...actualConfig,
		...userConfig
	};
};

export default initialize;

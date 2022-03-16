import { setMode } from '@stencil/core';
import { get } from 'lodash-es';
import { StyleMode, UIComponentsConfig } from '../types';

export const initialize = (userConfig: UIComponentsConfig = {}) => {
	const defaultStyleMode = get(userConfig, 'styleMode', StyleMode.Night);

	const doc = window.document;
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
			elm = elm.parentElement;
		}
		return defaultStyleMode;
	});
};

export default initialize;

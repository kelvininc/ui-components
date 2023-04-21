import { JSX, h } from '@stencil/core';
import { LINK_MATCHER_REGEX } from './radio-list-item.config';
import { EAnchorTarget } from '../../types';

export const buildDescription = (description?: string): JSX.Element[] => {
	if (!description) return;

	const linkMatches = [...description.matchAll(LINK_MATCHER_REGEX)];
	const parsedJSX: JSX.Element[] = [];
	let curIdx = 0;

	for (const match of linkMatches) {
		const beforeLink = description.slice(curIdx, match.index);
		if (beforeLink.length > 0) {
			parsedJSX.push(beforeLink);
		}
		const [expression, label, href] = match;
		parsedJSX.push(<kv-link label={label} href={href} target={EAnchorTarget.NewTab} />);

		curIdx = match.index + expression.length;
	}

	const remainingText = description.slice(curIdx);
	if (remainingText.length > 0) {
		parsedJSX.push(remainingText);
	}

	return parsedJSX;
};

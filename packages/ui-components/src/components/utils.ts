import { isNil } from 'lodash-es';
import { DEFAULT_CONFIG } from '../globals/config';
import { UIComponentsConfig } from '../types';

export const getConfig = (): UIComponentsConfig => {
	if (typeof window !== 'undefined') {
		const KvUiComponents = window.KvUiComponents;
		if (!isNil(KvUiComponents) && !isNil(KvUiComponents.config)) {
			return KvUiComponents.config;
		}
	}

	return DEFAULT_CONFIG;
};

export const getCollapsedElement = (elements: ChildNode[]): HTMLElement | undefined => {
	if (elements.length === 0) {
		return;
	}

	const [firstElement, ...siblings] = elements as HTMLElement[];

	if (isOverflowEllipsis(firstElement as HTMLElement)) {
		return firstElement;
	}

	return getCollapsedElement(Array.from(firstElement.childNodes)) ?? getCollapsedElement(siblings);
};

export const isOverflowEllipsis = (element: HTMLElement): boolean => !isNodeText(element) && !isNodeComment(element) && getCssStyle(element, 'text-overflow') === 'ellipsis';

export const isNodeText = (element: HTMLElement): boolean => element.nodeName === '#text';

export const isNodeComment = (element: HTMLElement): boolean => element.nodeName === '#comment';

export const getCssStyle = (element: HTMLElement, prop: string): string => window.getComputedStyle(element, null).getPropertyValue(prop);

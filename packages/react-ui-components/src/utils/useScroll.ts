import { throttle } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

export function getScrollTop(element?: HTMLDivElement) {
	if (element) {
		const { scrollTop } = element;

		return scrollTop;
	}

	return 0;
}

export function getScrollBottom(element?: HTMLDivElement) {
	if (element) {
		const { scrollHeight, offsetHeight, scrollTop } = element;

		return scrollHeight - offsetHeight - scrollTop;
	}

	return 0;
}

export function getScrollLeft(element?: HTMLDivElement) {
	if (element) {
		const { scrollLeft } = element;

		return scrollLeft;
	}

	return 0;
}

export function getScrollRight(element?: HTMLDivElement) {
	if (element) {
		const { scrollWidth, offsetWidth, scrollLeft } = element;

		return scrollWidth - offsetWidth - scrollLeft;
	}

	return 0;
}

export const useScroll = (
	elementRef?: HTMLDivElement,
	throttleTime = 0
): {
	scrollTop: number;
	scrollBottom: number;
	scrollLeft: number;
	scrollRight: number;
} => {
	const [scrollTop, setScrollTop] = useState(getScrollTop(elementRef));
	const [scrollBottom, setScrollBottom] = useState(getScrollBottom(elementRef));
	const [scrollLeft, setScrollLeft] = useState(getScrollLeft(elementRef));
	const [scrollRight, setScrollRight] = useState(getScrollRight(elementRef));

	const throttledUpdatePosition = useMemo(
		() =>
			throttle(() => {
				setScrollTop(getScrollTop(elementRef));
				setScrollBottom(getScrollBottom(elementRef));
				setScrollLeft(getScrollLeft(elementRef));
				setScrollRight(getScrollRight(elementRef));
			}, throttleTime),
		[elementRef, throttleTime]
	);

	useEffect(() => {
		if (!elementRef) return;

		elementRef.addEventListener('scroll', throttledUpdatePosition);

		return () => {
			elementRef.removeEventListener('scroll', throttledUpdatePosition);
		};
	}, [elementRef, throttledUpdatePosition]);

	return { scrollTop, scrollBottom, scrollLeft, scrollRight };
};

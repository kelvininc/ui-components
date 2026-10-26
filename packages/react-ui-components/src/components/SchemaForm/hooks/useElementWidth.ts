import { useLayoutEffect, useState } from 'react';

export const useElementWidth = (element?: HTMLElement | null): number => {
	const [width, setWidth] = useState(0);

	useLayoutEffect(() => {
		if (!element) {
			setWidth(0);
			return;
		}
		const update = () => setWidth(element.offsetWidth);
		update();
		if (typeof ResizeObserver === 'undefined') return;
		const observer = new ResizeObserver(update);
		observer.observe(element);
		return () => observer.disconnect();
	}, [element]);

	return width;
};

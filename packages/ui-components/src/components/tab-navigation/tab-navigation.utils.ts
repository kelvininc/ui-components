export const getIntersectionRelativeClientRect = (intersectionEntry: IntersectionObserverEntry, parent: HTMLKvTabNavigationElement) => {
	const rect = intersectionEntry.boundingClientRect;
	const parentRect = parent.getBoundingClientRect();

	return {
		x: rect.x,
		y: rect.y,
		bottom: parentRect.bottom - rect.bottom,
		height: rect.height,
		left: rect.left - parentRect.left,
		right: parentRect.right - rect.right,
		top: rect.top - parentRect.top,
		width: rect.width
	};
};

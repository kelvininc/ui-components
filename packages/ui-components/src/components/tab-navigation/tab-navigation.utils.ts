export const getIntersectionRelativeClientRect = (intersectionEntry: IntersectionObserverEntry) => {
	const rect = intersectionEntry.boundingClientRect;
	const parentRect = (intersectionEntry.target as HTMLKvTabItemElement).offsetParent.getBoundingClientRect();

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

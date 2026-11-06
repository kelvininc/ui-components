/** Reads a bare number as pixels and leaves any other CSS width as written. */
export const toLength = (value: unknown): string | undefined => {
	if (typeof value !== 'string' && typeof value !== 'number') return undefined;
	return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value.trim()) ? `${Number(value)}px` : value;
};

/** Caps configured lengths at the row's available space without changing CSS keywords. */
export const fitWidth = (value: unknown): string | undefined => {
	const length = toLength(value);
	const width = length?.trim();
	return !width || /^[a-z-]+$/i.test(width) ? length : `min(${width}, 100%)`;
};

/** Caps configured lengths at the row's available space without changing CSS keywords. */
export const fitWidth = (value: unknown): string | undefined => {
	if (typeof value !== 'string' && typeof value !== 'number') return undefined;
	if (typeof value === 'number' || /^\d+(\.\d+)?$/.test(value.trim())) return `min(${Number(value)}px, 100%)`;
	const width = value.trim();
	return !width || /^[a-z-]+$/i.test(width) ? value : `min(${width}, 100%)`;
};

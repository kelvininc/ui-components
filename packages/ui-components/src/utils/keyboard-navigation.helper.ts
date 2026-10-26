/** Finds the enabled neighbor, wrapping and skipping disabled options. An unset origin starts at an end. */
export const getNextEnabledIndex = (options: readonly { disabled?: boolean }[], current: number, step: 1 | -1): number => {
	let cursor = current >= 0 && current < options.length ? current : step === 1 ? -1 : 0;
	for (let visited = 0; visited < options.length; visited++) {
		cursor = (cursor + step + options.length) % options.length;
		if (!options[cursor].disabled) return cursor;
	}
	return -1;
};

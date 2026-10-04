export interface RadioGroupOption {
	value: string | number;
	checked?: boolean;
	disabled?: boolean;
}

/** The selected enabled radio owns the Tab stop; an unselected group uses its first enabled radio. */
export const getRadioGroupTabStop = (options: readonly RadioGroupOption[]): number => {
	const selected = options.findIndex(option => option.checked && !option.disabled);
	return selected >= 0 ? selected : options.findIndex(option => !option.disabled);
};

/** Selects and focuses the enabled neighbor of the radio that received the arrow key. */
export const handleRadioGroupKeyDown = (
	event: KeyboardEvent,
	options: readonly RadioGroupOption[],
	hosts: readonly HTMLElement[],
	onSelect: (value: string | number) => void
): void => {
	if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
	const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
	const path = event.composedPath();
	const origin = path[0] as HTMLElement | undefined;
	const current = hosts.findIndex(host => path.includes(host));
	if (!step || origin?.getAttribute?.('role') !== 'radio' || current < 0 || getRadioGroupTabStop(options) < 0) return;

	event.preventDefault();
	let next = current;
	do {
		next = (next + step + options.length) % options.length;
	} while (options[next].disabled);
	onSelect(options[next].value);
	hosts[next]?.focus();
};

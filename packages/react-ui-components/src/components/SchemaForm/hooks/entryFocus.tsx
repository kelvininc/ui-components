import React, { createContext, forwardRef, PropsWithChildren, useCallback, useContext, useImperativeHandle, useRef } from 'react';

export type EntryFocusTarget = (current: () => boolean) => Promise<boolean>;
type RegisterEntryFocus = (host: HTMLElement, focus: EntryFocusTarget) => () => void;
type FocusHost = HTMLElement & {
	componentOnReady?: () => Promise<unknown>;
	focusInput?: (canFocus?: () => boolean) => Promise<void>;
	setFocus?: (canFocus?: () => boolean) => Promise<void>;
};
const EntryFocusContext = createContext<RegisterEntryFocus | null>(null);

export const focusHost = async (host: FocusHost | null, current: () => boolean): Promise<boolean> => {
	if (!host?.isConnected || !current()) return false;
	try {
		await host.componentOnReady?.();
		if (!host.isConnected || !current()) return false;
		if (host.focusInput) await host.focusInput(current);
		else if (host.setFocus) await host.setFocus(current);
		else host.focus();
	} catch {
		return false;
	}
	return host.matches(':focus-within');
};

/** Registers the editable control in a widget, including a custom native input or Kelvin host. */
export const useSchemaFormFocusRef = <H extends HTMLElement>(disabled = false): React.RefCallback<H> => {
	const register = useContext(EntryFocusContext);
	const cleanup = useRef<(() => void) | undefined>(undefined);
	return useCallback(
		(host: H | null) => {
			cleanup.current?.();
			cleanup.current = host && !disabled ? register?.(host, current => focusHost(host, current)) : undefined;
		},
		[register, disabled]
	);
};

export const useEntryFocus = () => {
	const parent = useContext(EntryFocusContext);
	const targets = useRef(new Map<HTMLElement, EntryFocusTarget>());
	const register = useCallback<RegisterEntryFocus>(
		(host, focus) => {
			targets.current.set(host, focus);
			const removeParent = parent?.(host, focus);
			return () => {
				if (targets.current.get(host) === focus) targets.current.delete(host);
				removeParent?.();
			};
		},
		[parent]
	);
	const focus = useCallback<EntryFocusTarget>(async current => {
		const ordered = Array.from(targets.current).filter(([host]) => host.isConnected);
		ordered.sort(([first], [second]) => (first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
		for (const [, target] of ordered) {
			if (!current()) return false;
			if (await target(current)) return true;
		}
		return false;
	}, []);
	return { register, focus };
};

export const EntryFocusProvider = EntryFocusContext.Provider;
export type FocusEntryHandle = { focus: EntryFocusTarget };
export const FocusEntry = forwardRef<FocusEntryHandle, PropsWithChildren>((props, ref) => {
	const entry = useEntryFocus();
	useImperativeHandle(ref, () => ({ focus: entry.focus }), [entry.focus]);
	return <EntryFocusProvider value={entry.register}>{props.children}</EntryFocusProvider>;
});
FocusEntry.displayName = 'FocusEntry';

const holders = new WeakMap<HTMLElement, () => void>();
/** A named container holds focus only until its target is ready or the user moves away. */
export const focusFromHolder = (holder: HTMLElement | null, name: string, target: EntryFocusTarget | undefined, current: () => boolean) => {
	if (!holder?.isConnected || !current()) return;
	holders.get(holder)?.();
	const previous = ['tabindex', 'role', 'aria-label'].map(attribute => [attribute, holder.getAttribute(attribute)] as const);
	const restore = () => {
		holder.removeEventListener('blur', restore);
		holders.delete(holder);
		previous.forEach(([attribute, value]) => (value === null ? holder.removeAttribute(attribute) : holder.setAttribute(attribute, value)));
	};
	holders.set(holder, restore);
	holder.setAttribute('tabindex', '-1');
	holder.setAttribute('role', 'group');
	holder.setAttribute('aria-label', name);
	holder.addEventListener('blur', restore, { once: true });
	holder.focus({ preventScroll: true });
	const stillHere = () => current() && holder.matches(':focus');
	void target?.(stillHere);
};

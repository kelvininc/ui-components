import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { ArrayAction, ArrayItemsFocus, ArrayItemFocus } from '../contexts/ArrayItemContext';
import { focusFromHolder, focusHost } from './entryFocus';

export type ArrayFocusTarget = { kind: 'add' | 'list' } | { kind: 'item'; index: number; control: boolean };
export const getArrayFocusTarget = (action: ArrayAction, index: number, itemCount: number, canAdd: boolean, fixedItems = 0): ArrayFocusTarget => {
	if (action === 'add') return canAdd ? { kind: 'add' } : { kind: 'item', index, control: true };
	if (action === 'remove') return itemCount > fixedItems ? { kind: 'item', index: Math.min(index, itemCount - 1), control: false } : { kind: canAdd ? 'add' : 'list' };
	return { kind: 'item', index: index + (action === 'move-up' ? -1 : 1), control: false };
};

export const useArrayFocus = (itemCount: number, canAdd: boolean, inactive: boolean, name: string, formDataCount = itemCount, fixedItems = 0) => {
	const listRef = useRef<HTMLDivElement>(null);
	const addRef = useRef<HTMLKvActionButtonElement>(null);
	const entries = useRef(new Map<number, ArrayItemFocus>());
	const pending = useRef<{ action: ArrayAction; index: number } | null>(null);
	const generation = useRef(0);
	const requestFocus = useCallback(
		(action: ArrayAction, index: number) => {
			if (inactive) return;
			generation.current++;
			pending.current = { action, index };
		},
		[inactive]
	);
	const registerItem = useCallback<ArrayItemsFocus['registerItem']>((index, entry) => {
		entries.current.set(index, entry);
		return () => {
			if (entries.current.get(index) === entry) entries.current.delete(index);
		};
	}, []);
	const items = useMemo(() => ({ requestFocus, registerItem }), [requestFocus, registerItem]);
	useLayoutEffect(() => {
		generation.current++;
	}, [inactive, itemCount, canAdd]);
	useEffect(
		() => () => {
			generation.current++;
		},
		[]
	);
	useLayoutEffect(() => {
		const action = pending.current;
		if (!action) return;
		// RJSF's tuple template receives new keyed items before its formData and canAdd catch up.
		if (itemCount !== formDataCount) return;
		pending.current = null;
		const token = generation.current;
		const current = () => generation.current === token && !inactive;
		if (inactive) return;
		const target = getArrayFocusTarget(action.action, action.index, itemCount, canAdd, fixedItems);
		if (target.kind === 'add') {
			if (addRef.current?.matches(':focus-within')) return;
			focusFromHolder(listRef.current, name, check => focusHost(addRef.current, check), current);
		} else if (target.kind === 'item') {
			const entry = entries.current.get(target.index);
			focusFromHolder(listRef.current, name, target.control ? entry?.control : entry?.action, current);
		} else focusFromHolder(listRef.current, name, undefined, current);
	});
	return { listRef, addRef, items, requestFocus };
};

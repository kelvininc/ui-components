import { WidgetProps } from '@rjsf/utils';
import { isEqual } from 'lodash';
import { ChangeEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFormState } from '../../contexts';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import { extractFileInfo, processFiles } from './utils';

type FileValueProps = Pick<WidgetProps, 'id' | 'value' | 'multiple' | 'readonly' | 'disabled' | 'onChange'>;

export const useFileValue = ({ id, value, multiple, readonly, disabled, onChange }: FileValueProps) => {
	const { trackFieldChange, markFieldAsTouched, valueResetKey } = useFormState();
	const filesInfo = useMemo(() => extractFileInfo(value), [value]);
	const [readError, setReadError] = useState<string>();
	const inactive = Boolean(disabled || readonly);
	const current = useRef({
		values: filesInfo.map(file => file.value),
		propValue: value,
		id,
		multiple: Boolean(multiple),
		inactive,
		valueResetKey,
		sequence: 0,
		selection: 0,
		failedSelection: 0,
		mounted: false,
		pending: Promise.resolve(),
		commit: (_values: string[]) => {}
	});
	const invalidate = () => {
		current.current.sequence++;
		current.current.pending = Promise.resolve();
	};

	// Async callbacks use only committed props. An echo of our own change keeps other reads valid.
	useLayoutEffect(() => {
		const state = current.current;
		const values = filesInfo.map(file => file.value);
		const changed = !isEqual(value, state.propValue);
		if (
			state.id !== id ||
			state.multiple !== Boolean(multiple) ||
			state.inactive !== inactive ||
			state.valueResetKey !== valueResetKey ||
			(changed && !isEqual(values, state.values))
		) {
			invalidate();
			state.values = values;
			setReadError(undefined);
		} else if (changed) state.values = values;
		Object.assign(state, { propValue: value, id, multiple: Boolean(multiple), inactive, valueResetKey });
		state.commit = values => {
			state.values = values;
			const result = state.multiple ? values : values[0];
			trackFieldChange(id, result);
			onChange(result);
		};
	});
	useLayoutEffect(() => {
		current.current.mounted = true;
		return () => {
			current.current.mounted = false;
			invalidate();
		};
	}, []);

	const removeFile = (index: number) => {
		const state = current.current;
		if (!state.mounted || state.inactive) return;
		state.commit(state.values.filter((_, position) => position !== index));
	};
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const state = current.current;
		const files = Array.from(event.currentTarget.files ?? []);
		if (!state.mounted || state.inactive || !files.length) return;
		event.currentTarget.value = '';
		markFieldAsTouched(id);
		setReadError(undefined);
		if (!state.multiple) invalidate();
		const sequence = state.sequence;
		const selection = ++state.selection;
		const active = () => state.mounted && !state.inactive && state.sequence === sequence;
		// Report failures independently of the queue that preserves value order.
		const read = processFiles(files).then(
			files => ({ files }),
			error => {
				if (active()) {
					state.failedSelection = Math.max(state.failedSelection, selection);
					setReadError(SCHEMA_FORM_STRINGS.fileReadFailed);
				}
				return { error };
			}
		);
		state.pending = state.pending
			.then(() => read)
			.then(result => {
				if (!active() || 'error' in result) return;
				const values = result.files.map(file => file.value);
				if (selection > state.failedSelection) setReadError(undefined);
				state.commit(state.multiple ? state.values.concat(values) : values.slice(0, 1));
			});
	};
	return { filesInfo, removeFile, handleChange, readError };
};

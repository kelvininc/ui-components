import { FieldTemplateProps, FormContextType, getUiOptions, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React, { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { ChoiceControlContext, useFormState } from '../../contexts';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import { canClearChoice, getChoicePresentation } from './utils';
import styles from './FieldTemplate.module.scss';

type ChoiceExtrasProps<T, S extends StrictRJSFSchema, F extends FormContextType> = FieldTemplateProps<T, S, F> & {
	/** The "Not set" annotation, which takes focus when clearing leaves no enabled option to move it to */
	notSetRef?: RefObject<HTMLSpanElement>;
};

const ChoiceExtras = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: ChoiceExtrasProps<T, S, F>) => {
	const { id, label, formData, onChange, uiSchema, registry, children, notSetRef } = props;
	const fieldTitle = getUiOptions(uiSchema, registry.globalUiOptions).title ?? label;
	const hostRef = useContext(ChoiceControlContext);
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const { choice } = getChoicePresentation(props);
	const unset = formData === undefined;
	const canClear = canClearChoice(props);
	const [focusRequest, requestFocus] = useState(0);
	const pendingFocus = useRef(false);

	useEffect(() => {
		if (!pendingFocus.current) return;
		if (!canClear) {
			pendingFocus.current = false;
			return;
		}
		if (!unset) return;
		pendingFocus.current = false;
		const host = hostRef?.current;
		let cancelled = false;
		// React commits the cleared value first; the public core API chooses the first enabled option.
		Promise.resolve().then(async () => {
			if (cancelled || !host?.isConnected || hostRef?.current !== host) return;
			try {
				await host.setFocus();
			} catch {
				// A host that cannot take focus falls through to "Not set" below
			}
			// With every option disabled nothing takes focus, and Clear selection is gone: land on the "Not set" that replaced it
			if (!cancelled && !host.matches(':focus-within')) notSetRef?.current?.focus();
		});
		return () => {
			cancelled = true;
		};
	}, [focusRequest, unset, canClear, hostRef, notSetRef]);

	if (!choice || !canClear) return <>{children}</>;
	// Clear selection takes the footer's right side once a value is picked; while unset, "Not set" holds it instead
	return (
		<div className={styles.ChoiceExtras}>
			{children && <div className={styles.ChoiceFeedback}>{children}</div>}
			{!unset && (
				<button
					type="button"
					aria-label={SCHEMA_FORM_STRINGS.clearSelectionFor(fieldTitle.trim() || id)}
					className={styles.ClearSelection}
					onClick={() => {
						pendingFocus.current = true;
						trackFieldChange(id, undefined);
						markFieldAsTouched(id);
						onChange(undefined);
						requestFocus(request => request + 1);
					}}
				>
					{SCHEMA_FORM_STRINGS.clearSelection}
				</button>
			)}
		</div>
	);
};
export default ChoiceExtras;

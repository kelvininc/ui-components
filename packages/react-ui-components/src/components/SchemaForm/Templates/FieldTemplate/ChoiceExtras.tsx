import { FieldTemplateProps, FormContextType, getUiOptions, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChoiceControlContext, useFormState } from '../../contexts';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import { resolveAllowClearInputs } from '../../Widgets/utils';
import { getChoicePresentation } from './utils';
import styles from './FieldTemplate.module.scss';

const ChoiceExtras = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const { id, label, formData, onChange, required, disabled, readonly, uiSchema, registry, children } = props;
	const fieldTitle = getUiOptions(uiSchema, registry.globalUiOptions).title ?? label;
	const hostRef = useContext(ChoiceControlContext);
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const { choice, radio } = getChoicePresentation(props);
	const unset = formData === undefined;
	const canClear = radio && !required && !disabled && !readonly && (resolveAllowClearInputs(uiSchema, registry) ?? true);
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
		Promise.resolve().then(() => {
			if (!cancelled && host?.isConnected && hostRef?.current === host) void host.setFocus();
		});
		return () => {
			cancelled = true;
		};
	}, [focusRequest, unset, canClear, hostRef]);

	if (!choice || (!unset && !canClear)) return <>{children}</>;
	const annotation = unset && <span className={styles.NotSet}>{SCHEMA_FORM_STRINGS.notSet}</span>;
	return (
		<>
			<div className={styles.ChoiceExtras}>
				{radio && children ? (
					<div className={styles.ChoiceFeedback}>
						{children}
						{annotation}
					</div>
				) : (
					annotation
				)}
				{canClear && (
					<button
						type="button"
						aria-label={SCHEMA_FORM_STRINGS.clearSelectionFor(fieldTitle.trim() || id)}
						className={styles.ClearSelection}
						aria-disabled={unset}
						tabIndex={unset ? -1 : 0}
						onClick={() => {
							if (unset) return;
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
			{!radio && children}
		</>
	);
};
export default ChoiceExtras;

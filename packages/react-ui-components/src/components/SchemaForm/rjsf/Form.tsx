import Form, { FormProps, FormState } from '@rjsf/core';
import { deepEquals, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { isEqual } from 'lodash';

export type ValidationConfig<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> = Pick<
	FormProps<T, S, F>,
	| 'schema'
	| 'uiSchema'
	| 'validator'
	| 'customValidate'
	| 'transformErrors'
	| 'liveValidate'
	| 'noValidate'
	| 'extraErrors'
	| 'experimental_defaultFormStateBehavior'
	| 'experimental_customMergeAllOf'
>;

export function getValidationConfig<T, S extends StrictRJSFSchema, F extends FormContextType>(props: FormProps<T, S, F>): ValidationConfig<T, S, F> {
	const {
		schema,
		uiSchema,
		validator,
		customValidate,
		transformErrors,
		liveValidate,
		noValidate,
		extraErrors,
		experimental_defaultFormStateBehavior,
		experimental_customMergeAllOf
	} = props;
	return {
		schema,
		uiSchema,
		validator,
		customValidate,
		transformErrors,
		liveValidate,
		noValidate,
		extraErrors,
		experimental_defaultFormStateBehavior,
		experimental_customMergeAllOf
	};
}

export function areValidationConfigsEqual<T, S extends StrictRJSFSchema, F extends FormContextType>(previous: ValidationConfig<T, S, F>, next: ValidationConfig<T, S, F>): boolean {
	return (
		previous.validator === next.validator &&
		previous.customValidate === next.customValidate &&
		previous.transformErrors === next.transformErrors &&
		previous.experimental_customMergeAllOf === next.experimental_customMergeAllOf &&
		isEqual(previous, next)
	);
}

/** RJSF 5 compares incoming data with the previous prop, which can precede the current edit. */
export default class GuardedForm<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> extends Form<T, S, F> {
	getSnapshotBeforeUpdate(prevProps: FormProps<T, S, F>, prevState: FormState<T, S, F>): ReturnType<Form<T, S, F>['getSnapshotBeforeUpdate']> {
		const preserveErrors = deepEquals(this.props.formData, this.state.formData) && areValidationConfigsEqual(getValidationConfig(prevProps), getValidationConfig(this.props));
		if (preserveErrors && prevProps.idPrefix === this.props.idPrefix && prevProps.idSeparator === this.props.idSeparator) return { shouldUpdate: false };
		const snapshot = super.getSnapshotBeforeUpdate(prevProps, prevState);
		if (!preserveErrors || !snapshot.shouldUpdate) return snapshot;
		// Let upstream derive new ids without replacing the current native error state.
		const nextState = {
			...snapshot.nextState,
			errors: this.state.errors,
			errorSchema: this.state.errorSchema,
			schemaValidationErrors: this.state.schemaValidationErrors,
			schemaValidationErrorSchema: this.state.schemaValidationErrorSchema
		};
		return deepEquals(nextState, prevState) ? { shouldUpdate: false } : { nextState, shouldUpdate: true };
	}
}

import Inputmask from 'inputmask';
import { getUTF8StringLength } from '../../utils/string.helper';
import { COMMON_INPUT_MASK_CONFIG, DATE_TIME_INPUT_MASK_CONFIG } from './text-field.config';
import { EInputFieldType, IInputMaskInstanceRef } from './text-field.types';

export function getInputMaskConfig(type: EInputFieldType): Inputmask.Options {
	if (type === EInputFieldType.Text) {
		return COMMON_INPUT_MASK_CONFIG;
	}

	if (type === EInputFieldType.DateTime) {
		return DATE_TIME_INPUT_MASK_CONFIG;
	}

	return {
		alias: 'numeric',
		...COMMON_INPUT_MASK_CONFIG
	};
}

export function isInputMaskCompatibleType(type: EInputFieldType): boolean {
	return [EInputFieldType.Number, EInputFieldType.Text, EInputFieldType.DateTime].includes(type);
}

const getNumericAliasDefinition = (): Inputmask.Options => (Inputmask as unknown as { prototype: { aliases: Record<string, Inputmask.Options> } }).prototype.aliases.numeric ?? {};

/**
 * Tames when the numeric alias enforces `min`/`max` so the displayed value can always be kept
 * in sync with the `value` prop:
 *
 * - Programmatic writes (`value` prop changes, initial value, re-renders) render as-is: the
 *   clamping hooks (`onBeforeMask` and the `checkval` path of `onBeforeWrite`) run with the
 *   limits disabled, so the mask never rewrites what the consumer state holds.
 * - While the user is editing, out-of-range keystrokes and pastes are rejected by the alias
 *   `postValidation` lock (applied only while the input is focused).
 * - On blur, the alias clamps the left value to the limits as usual, and the component adopts
 *   and propagates the rewritten value through `textChange` (see `syncValueWithNativeInput`
 *   in the component).
 */
function buildNumericLimitsOverrides(input: HTMLInputElement): Inputmask.Options {
	const numericAlias = getNumericAliasDefinition();
	const withoutLimits = (opts: Inputmask.Options): Inputmask.Options => ({
		...opts,
		min: undefined,
		max: undefined
	});
	const isUserEditing = (): boolean => (input.getRootNode() as Document | ShadowRoot).activeElement === input;

	return {
		onBeforeMask(initialValue, opts) {
			return numericAlias.onBeforeMask ? numericAlias.onBeforeMask.call(this, initialValue, withoutLimits(opts)) : initialValue;
		},
		onBeforeWrite(event, buffer, caretPos, opts) {
			// only the blur path clamps to the limits; the alias hook returns undefined when there is nothing to rewrite; the types don't allow it
			return numericAlias.onBeforeWrite?.call(this, event, buffer, caretPos, event?.type === 'blur' ? opts : withoutLimits(opts)) as Inputmask.CommandObject;
		},
		postValidation(buffer, pos, char, currentResult, opts, maskset, strict, fromCheckval) {
			if (!numericAlias.postValidation) {
				return currentResult;
			}

			return numericAlias.postValidation.call(this, buffer, pos, char, currentResult, isUserEditing() ? opts : withoutLimits(opts), maskset, strict, fromCheckval);
		}
	};
}

export function buildInputMask(input: HTMLInputElement, inputType: EInputFieldType, options: Inputmask.Options, maxLength?: number): IInputMaskInstanceRef {
	const numericLimitsOverrides = inputType === EInputFieldType.Number ? buildNumericLimitsOverrides(input) : {};

	// @ts-ignore the types library for Inputmask has the callback type definition for onBeforePaste incorrect, it should return string | false
	return Inputmask({
		...getInputMaskConfig(inputType),
		...options,
		...numericLimitsOverrides,
		onBeforePaste: (fieldValue: string) => {
			if (!maxLength) return fieldValue;
			return getUTF8StringLength(fieldValue) <= maxLength ? fieldValue : false;
		}
	}).mask(input) as IInputMaskInstanceRef;
}

export function getValueAsString(newValue?: string | number | null): string {
	return typeof newValue === 'number' ? newValue.toString() : (newValue || '').toString();
}

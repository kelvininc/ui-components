import { isConstant, isObject, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

/**
 * Mirrors RJSF 5 `isSelect` on an already resolved schema, checking the branches `optionsList` reads
 * (`anyOf` before `oneOf`). When this is false, `optionsList` throws on the first non-constant branch.
 * See the contract test.
 */
export const hasConstantOptions = <S extends StrictRJSFSchema = RJSFSchema>(schema: S): boolean => {
	if (Array.isArray(schema.enum)) return true;
	const alternatives = schema.anyOf ?? schema.oneOf;
	return Array.isArray(alternatives) && alternatives.every(option => isObject(option) && isConstant(option as S));
};

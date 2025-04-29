import { EApplyDefaults } from '../../components/SchemaForm/types';
import { ExperimentalAllOf, ExperimentalArrayMinItems, ExperimentalConstAsDefaults, ExperimentalEmptyObjectFields } from './types';

export const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_OBJECT: Record<EApplyDefaults, ExperimentalEmptyObjectFields> = {
	[EApplyDefaults.All]: 'populateAllDefaults',
	[EApplyDefaults.RequiredOnly]: 'populateRequiredDefaults',
	[EApplyDefaults.Never]: 'skipDefaults'
};

export const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ARRAY: Record<EApplyDefaults, ExperimentalArrayMinItems> = {
	[EApplyDefaults.All]: 'all',
	[EApplyDefaults.RequiredOnly]: 'requiredOnly',
	[EApplyDefaults.Never]: 'never'
};

export const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ALL_OFF: Record<EApplyDefaults, ExperimentalAllOf> = {
	[EApplyDefaults.All]: 'populateDefaults',
	[EApplyDefaults.RequiredOnly]: 'populateDefaults',
	[EApplyDefaults.Never]: 'skipDefaults'
};

export const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_CONST_AS_DEFAULT: Record<EApplyDefaults, ExperimentalConstAsDefaults> = {
	[EApplyDefaults.All]: 'skipOneOf',
	[EApplyDefaults.RequiredOnly]: 'skipOneOf',
	[EApplyDefaults.Never]: 'never'
};

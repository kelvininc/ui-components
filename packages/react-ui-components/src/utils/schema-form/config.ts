import { EApplyDefaults } from '../../components/SchemaForm/types';
import { ExperimentalArrayMinItems, ExperimentalEmptyObjectFields } from './types';

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

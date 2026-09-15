import type { EIconName } from '@kelvininc/ui-components';

export const DEFAULT_MINIMUM_SEARCHABLE_OPTIONS = 15;

export interface IDropdownConfig {
	zIndex: number;
	maxHeight: string;
	minHeight: string;
	maxWidth: string;
	minWidth: string;
	icon?: EIconName;
}

export const DEFAULT_DROPDOWN_CONFIG: IDropdownConfig = {
	// Kept in step with `DEFAULT_DROPDOWN_Z_INDEX` from `@kelvininc/ui-components`,
	// which is re-exported from this package so consumers never hardcode it. It is
	// duplicated rather than imported so this module stays free of a runtime
	// dependency on the built web components, which keeps these unit tests hermetic.
	zIndex: 9004,
	maxHeight: '400px',
	minHeight: 'auto',
	maxWidth: 'auto',
	minWidth: 'max-content'
};

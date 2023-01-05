import { IMultiSelectDropdownOptions, ISingleSelectDropdownOptions } from '@kelvininc/ui-components';

export type IUIDropdownOptions = ISingleSelectDropdownOptions | IMultiSelectDropdownOptions;

export type EnumOptions = string | number | boolean | object | any[] | null;

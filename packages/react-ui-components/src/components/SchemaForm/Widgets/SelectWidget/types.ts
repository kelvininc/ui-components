import { ISelectMultiOptions, ISingleSelectDropdownOptions } from '@kelvininc/ui-components';

export type IUIDropdownOptions = ISingleSelectDropdownOptions | ISelectMultiOptions;

export type EnumOptions = string | number | boolean | object | any[] | null;

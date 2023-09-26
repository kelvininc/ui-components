import { ISelectMultiOptions, ISelectSingleOptions } from '@kelvininc/ui-components';

export type IUIDropdownOptions = ISelectSingleOptions | ISelectMultiOptions;

export type EnumOptions = string | number | boolean | object | any[] | null;

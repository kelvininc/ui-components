import { IToaster } from '@kelvininc/ui-components';

export interface IToasterState extends IToaster {
	/** (required) Toaster Active */
	toasterActive: boolean;
}

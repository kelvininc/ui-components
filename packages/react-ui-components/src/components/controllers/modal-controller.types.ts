import { IModal } from '@kelvininc/ui-components';

export interface IModalState extends IModal {
	/** (required) Modal Active */
	modalActive: boolean;
}

import { IModalConfig } from '@kelvininc/ui-components';

export interface IModalController {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	config?: IModalConfig;
}

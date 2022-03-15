import { IAnchor } from '../../utils/types';

export interface IBreadcrumbItem extends IAnchor {
	label: string;
	active?: boolean;
}

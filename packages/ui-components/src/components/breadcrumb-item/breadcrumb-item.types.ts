import { IAnchor } from '../../utils/types/anchor';

export interface IBreadcrumbItem extends IAnchor {
	label: string;
	active?: boolean;
}

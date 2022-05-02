import { EventEmitter } from '@stencil/core';
import { IAnchor } from '../../utils/types';

export interface IBreadcrumbItem extends IAnchor {
	/** (required) The text to display on the breadcrumb */
	label: string;
	/** (optional) Sets this breadcrumb styling to be the active one (usually the last one) */
	active?: boolean;
}

export interface IBreadcrumbItemEvents {
	/** Emitted when the user clicks on the breadcrumb */
	breadcrumbItemClick: EventEmitter<IBreadcrumbItem>;
}

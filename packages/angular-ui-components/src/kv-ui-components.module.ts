import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import {
	KvActionButton,
	KvSwitchButton,
	KvLink,
	KvBreadcrumb,
	KvBreadcrumbItem,
	KvBreadcrumbList,
	KvLoader,
	KvStateIndicator,
	KvRadioButton,
	KvSvgIcon,
	KvTagLetter
} from './stencil-generated/component';

defineCustomElements(window);

const COMPONENTS = [
	KvActionButton,
	KvSwitchButton,
	KvLink,
	KvBreadcrumb,
	KvBreadcrumbItem,
	KvBreadcrumbList,
	KvLoader,
	KvStateIndicator,
	KvRadioButton,
	KvSvgIcon,
	KvTagLetter
];

@NgModule({
	declarations: COMPONENTS,
	exports: COMPONENTS,
	imports: [CommonModule],
	providers: []
})
export class KvUIComponentsModule { }

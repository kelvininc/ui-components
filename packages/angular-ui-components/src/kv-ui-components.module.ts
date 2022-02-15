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
	KvTagLetter,
	KvTabItem,
	KvTabList,
	KvTabNavigation,
	KvTextField
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
	KvTagLetter,
	KvTabItem,
	KvTabList,
	KvTabNavigation,
	KvTextField
];

@NgModule({
	declarations: COMPONENTS,
	exports: COMPONENTS,
	imports: [CommonModule],
	providers: []
})
export class KvUIComponentsModule { }

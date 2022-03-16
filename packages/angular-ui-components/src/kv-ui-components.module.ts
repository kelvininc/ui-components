import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import {
	KvActionButton,
	KvActionButtonIcon,
	KvActionButtonText,
	KvActionButtonSplit,
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
	KvTabNavigation
} from './stencil-generated/component';

defineCustomElements(window);

const COMPONENTS = [
	KvActionButton,
	KvActionButtonIcon,
	KvActionButtonText,
	KvActionButtonSplit,
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
	KvTabNavigation
];

@NgModule({
	declarations: COMPONENTS,
	exports: COMPONENTS,
	imports: [CommonModule],
	providers: []
})
export class KvUIComponentsModule { }

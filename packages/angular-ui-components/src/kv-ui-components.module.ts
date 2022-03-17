import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import {
	KvActionButton,
	KvActionButtonIcon,
	KvActionButtonSplit,
	KvActionButtonText,
	KvBreadcrumb,
	KvBreadcrumbItem,
	KvBreadcrumbList,
	KvIllustration,
	KvLink,
	KvLoader,
	KvRadioButton,
	KvStateIndicator,
	KvSvgIcon,
	KvSwitchButton,
	KvTabItem,
	KvTabList,
	KvTabNavigation,
	KvTagLetter,
	KvTextField,
	KvTooltip,
	KvSummaryCard
} from './stencil-generated/component';

defineCustomElements(window);

const COMPONENTS = [
	KvActionButton,
	KvActionButtonIcon,
	KvActionButtonText,
	KvActionButtonSplit,
	KvSwitchButton,
	KvIllustration,
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
	KvTextField,
	KvTooltip,
	KvSummaryCard
];

@NgModule({
	declarations: COMPONENTS,
	exports: COMPONENTS,
	imports: [CommonModule],
	providers: []
})
export class KvUIComponentsModule {}

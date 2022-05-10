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
	KvRadio,
	KvStateIndicator,
	KvSearch,
	KvIcon,
	KvSwitchButton,
	KvTabItem,
	KvTabList,
	KvTabNavigation,
	KvTagLetter,
	KvTextField,
	KvToaster,
	KvTooltip,
	KvSummaryCard,
	KvRadioButton,
	KvRadioButtonGroup,
	KvInfoLabel,
	KvTreeItem
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
	KvRadio,
	KvIcon,
	KvTagLetter,
	KvTabItem,
	KvTabList,
	KvTabNavigation,
	KvTextField,
	KvTooltip,
	KvSummaryCard,
	KvSearch,
	KvToaster,
	KvRadioButton,
	KvRadioButtonGroup,
	KvInfoLabel,
	KvTreeItem
];

@NgModule({
	declarations: COMPONENTS,
	exports: COMPONENTS,
	imports: [CommonModule],
	providers: []
})
export class KvUIComponentsModule {}

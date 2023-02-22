import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import {
	KvActionButton,
	KvActionButtonIcon,
	KvActionButtonSplit,
	KvActionButtonText,
	KvAdvancedDateSelectDropdown,
	KvAlert,
	KvBadge,
	KvBreadcrumb,
	KvBreadcrumbItem,
	KvBreadcrumbList,
	KvSelect,
	KvSelectGroup,
	KvSelectOption,
	KvCalendar,
	KvCalendarDay,
	KvCalendarSingleDateSelector,
	KvCalendarRangeDatesSelector,
	KvCalendarAdvancedDateSelector,
	KvCheckbox,
	KvDropdown,
	KvDropdownBase,
	KvSingleSelectDropdown,
	KvMultiSelectDropdown,
	KvIllustration,
	KvLink,
	KvLoader,
	KvRadio,
	KvSingleDateSelectDropdown,
	KvRangeDatesSelectDropdown,
	KvStateIndicator,
	KvSearch,
	KvStepBar,
	KvStepIndicator,
	KvStepProgressBar,
	KvIcon,
	KvSwitchButton,
	KvTabItem,
	KvTabNavigation,
	KvTag,
	KvTagLetter,
	KvTagAlarm,
	KvTextField,
	KvToaster,
	KvTooltip,
	KvToggleTip,
	KvSummaryCard,
	KvRadioButton,
	KvRadioButtonGroup,
	KvInfoLabel,
	KvTreeItem,
	KvTree,
	KvModal,
	KvFormHelpText,
	KvFormLabel,
	KvRange,
	KvWizard,
	KvWizardHeader,
	KvWizardFooter
} from './stencil-generated/component';

defineCustomElements(window);

const COMPONENTS = [
	KvActionButton,
	KvActionButtonIcon,
	KvActionButtonText,
	KvActionButtonSplit,
	KvAdvancedDateSelectDropdown,
	KvAlert,
	KvBadge,
	KvCheckbox,
	KvSwitchButton,
	KvIllustration,
	KvLink,
	KvBreadcrumb,
	KvBreadcrumbItem,
	KvBreadcrumbList,
	KvCalendar,
	KvCalendarDay,
	KvCalendarSingleDateSelector,
	KvCalendarRangeDatesSelector,
	KvCalendarAdvancedDateSelector,
	KvCalendar,
	KvLoader,
	KvStateIndicator,
	KvRadio,
	KvSingleDateSelectDropdown,
	KvRangeDatesSelectDropdown,
	KvIcon,
	KvTag,
	KvTagLetter,
	KvTagAlarm,
	KvTabItem,
	KvTabNavigation,
	KvTextField,
	KvTooltip,
	KvToggleTip,
	KvSummaryCard,
	KvSearch,
	KvSelect,
	KvSelectGroup,
	KvSelectOption,
	KvStepBar,
	KvStepIndicator,
	KvStepProgressBar,
	KvDropdown,
	KvDropdownBase,
	KvSingleSelectDropdown,
	KvMultiSelectDropdown,
	KvToaster,
	KvRadioButton,
	KvRadioButtonGroup,
	KvInfoLabel,
	KvTreeItem,
	KvTree,
	KvModal,
	KvFormHelpText,
	KvFormLabel,
	KvRange,
	KvWizard,
	KvWizardHeader,
	KvWizardFooter
];

@NgModule({
	declarations: COMPONENTS,
	exports: COMPONENTS,
	imports: [CommonModule],
	providers: []
})
export class KvUIComponentsModule {}

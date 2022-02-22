import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import { KvActionButton, KvSwitchButton, KvLink } from './generated/component';

defineCustomElements(window);

const COMPONENTS = [
	KvActionButton,
	KvSwitchButton,
	KvLink
];

@NgModule({
	declarations: COMPONENTS,
	exports: COMPONENTS,
	imports: [CommonModule],
	providers: []
})
export class KvUIComponentsModule { }

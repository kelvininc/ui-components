import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import { KvActionButton } from './generated/component';

defineCustomElements(window);

const COMPONENTS = [
	KvActionButton,
];

@NgModule({
	declarations: COMPONENTS,
	exports: COMPONENTS,
	imports: [CommonModule],
	providers: []
})
export class ComponentLibraryModule { }

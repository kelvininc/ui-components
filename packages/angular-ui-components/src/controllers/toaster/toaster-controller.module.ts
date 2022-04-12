import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToasterController } from './toaster-controller.component';

@NgModule({
	declarations: [ToasterController],
	imports: [
		CommonModule
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	exports: [ToasterController]
})
export class ToasterControllerModule { }
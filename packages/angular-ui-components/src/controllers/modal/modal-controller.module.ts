import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController } from './modal-controller.component';

@NgModule({
	declarations: [ModalController],
	imports: [
		CommonModule
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	exports: [ModalController]
})
export class ModalControllerModule { }

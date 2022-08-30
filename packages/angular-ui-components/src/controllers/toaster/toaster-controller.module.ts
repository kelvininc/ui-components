import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToasterControllerComponent } from './toaster-controller.component';

@NgModule({
	declarations: [ToasterControllerComponent],
	imports: [CommonModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [ToasterControllerComponent]
})
export class ToasterControllerModule {}

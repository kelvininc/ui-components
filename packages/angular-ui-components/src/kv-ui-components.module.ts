import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import { DIRECTIVES } from './stencil-generated';

@NgModule({
	declarations: [...DIRECTIVES],
	exports: [...DIRECTIVES],
	imports: [CommonModule],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: () => defineCustomElements,
			multi: true
		}
	]
})
export class KvUIComponentsModule {}

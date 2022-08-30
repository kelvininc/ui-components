import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ToasterService } from './toaster-controller.service';
import { IToaster, EToasterType } from '@kelvininc/ui-components';

@Component({
	selector: 'kv-toaster-controller',
	template: `
		<div *ngIf="this.header && this.type">
			<kv-toaster
				[header]="header"
				[description]="description"
				[ttl]="ttl"
				[type]="type"
				(ttlExpired)="onCloseToaster"
				(clickCloseButton)="onCloseToaster"
			></kv-toaster>
		</div>
	`
})
export class ToasterControllerComponent implements OnInit, OnDestroy {
	header!: string | null;
	description?: string = '';
	type!: EToasterType | null;
	ttl?: number = 0;

	unsubscriber$: Subject<void> = new Subject();

	constructor(public toastService: ToasterService) { }

	ngOnInit() {
		this.toastService.getMessageObservable()
			.pipe(
				takeUntil(this.unsubscriber$)
			)
			.subscribe((message: IToaster) => this.initToaster(message));

		this.toastService.getCloseObservable()
			.pipe(
				tap(() => this.onClose()),
				takeUntil(this.unsubscriber$)
			)
			.subscribe();
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	onCloseToaster(event: CustomEvent) {
		event.preventDefault();
		this.onClose();
	}

	initToaster(newMessage: IToaster) {
		this.header = newMessage.header;
		this.description = newMessage.description ?? '';
		this.type = newMessage.type;

		if (newMessage && newMessage.ttl) {
			this.ttl = newMessage.ttl;
		}
	}

	onClose() {
		this.header = null;
		this.description = '';
		this.type = null;
		this.ttl = 0;
	}
}
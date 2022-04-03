import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ModalService } from './modal-controller.service';
import { IModal } from '@kelvininc/ui-components';

@Component({
	selector: 'kv-modal-controller',
	template: `
		<div *ngIf="this.modalTitle">
			<kv-modal
				[modalTitle]="modalTitle"
				[center]="center"
				[closeClickOutside]="closeClickOutside"
				(clickCloseButton)="onCloseToaster"
			></kv-modal>
		</div>
	`
})
export class ModalController implements OnInit, OnDestroy {
	modalTitle?: string | null;
	center?: boolean = false;
	closeClickOutside?: boolean = false;

	unsubscriber$: Subject<void> = new Subject();

	constructor(public modalService: ModalService) { }

	ngOnInit() {
		this.modalService.getModalObservable()
			.pipe(
				takeUntil(this.unsubscriber$)
			)
			.subscribe((modal: IModal) => this.initModal(modal));

		this.modalService.getCloseObservable()
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

	onCloseModal(event: CustomEvent) {
		event.preventDefault();
		this.onClose();
	}

	initModal(newModal: IModal) {
		this.modalTitle = newModal.modalTitle;
		this.center = newModal.center ?? false;
		this.closeClickOutside = newModal.closeClickOutside ?? false;
	}

	onClose() {
		this.modalTitle = null;
		this.center = undefined;
		this.closeClickOutside = undefined;
	}
}

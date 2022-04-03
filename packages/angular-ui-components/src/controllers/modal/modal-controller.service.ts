import { Injectable } from '@angular/core';
import { IModal } from '@kelvininc/ui-components';
import { Subject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	private modalSubject = new Subject<IModal>();
	private close$ = new Subject<void>();

	close() {
		this.close$.next();
	}

	getModalObservable(): Observable<IModal> {
		return this.modalSubject.asObservable();
	}

	getCloseObservable(): Observable<void> {
		return this.close$.asObservable();
	}

	showModal(modalTitle: string, center: boolean, closeClickOutside: boolean) {
		this.modalSubject.next({ modalTitle, center, closeClickOutside});
	}
}

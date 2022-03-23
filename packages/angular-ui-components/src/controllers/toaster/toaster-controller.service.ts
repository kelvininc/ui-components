import { Injectable } from '@angular/core';
import { IToaster, EToasterType } from '@kelvininc/ui-components';
import { Subject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ToasterService {
	private toasterSubject = new Subject<IToaster>();
	private close$ = new Subject<void>();

	info(header: string, description?: string, ttl?: number) {
		this.publishMessage(EToasterType.Info, header, description, ttl);
	}

	warning(header: string, description?: string, ttl?: number) {
		this.publishMessage(EToasterType.Warning, header, description, ttl);
	}

	error(header: string, description?: string, ttl?: number) {
		this.publishMessage(EToasterType.Error, header, description, ttl);
	}

	success(header: string, description?: string, ttl?: number) {
		this.publishMessage(EToasterType.Success, header, description, ttl);
	}

	close() {
		this.close$.next();
	}

	getMessageObservable(): Observable<IToaster> {
		return this.toasterSubject.asObservable();
	}

	getCloseObservable(): Observable<void> {
		return this.close$.asObservable();
	}

	private publishMessage(type: EToasterType, header: string, description?: string, ttl?: number) {
		this.toasterSubject.next({ type, header, description, ttl});
	}
}
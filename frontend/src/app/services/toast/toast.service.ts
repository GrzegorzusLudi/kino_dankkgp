import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Toast } from '../../models/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new Subject<Toast>();

  get get(): Observable<Toast> {
    return this.toastSubject.asObservable();
  }

  next(toast: Toast): void {
    this.toastSubject.next(toast);
  }
}

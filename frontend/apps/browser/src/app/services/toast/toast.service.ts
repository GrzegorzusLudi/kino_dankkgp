import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Toast } from '../../models/toast.interface';
import { ToastInput } from '../../models/toast-input.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new Subject<Toast>();

  get get(): Observable<Toast> {
    return this.toastSubject.asObservable();
  }

  next(input: Readonly<ToastInput>): void {
    this.toastSubject.next({
      ...input,
      id: crypto.randomUUID(),
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Toast } from '../../models/toast.interface';

interface ToastInput {
  title: string;
  message: string;
  variant: 'info' | 'success' | 'danger';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new Subject<Toast>();

  get get(): Observable<Toast> {
    return this.toastSubject.asObservable();
  }

  next(input: ToastInput): void {
    this.toastSubject.next({
      ...input,
      id: crypto.randomUUID(),
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { Toast } from '../../models/toast.interface';
import { ApiService } from '../../services/api/api.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  imports: [AsyncPipe, ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private subscription = new Subscription();

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.apiService.error
        .pipe(
          tap((error) => {
            if (error) {
              this.toastsSubject.next([
                ...this.toastsSubject.getValue(),
                {
                  id: crypto.randomUUID(),
                  title: 'Error',
                  message: error,
                  variant: 'danger',
                },
              ]);
            }
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get toasts(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  removeToast(id: string): void {
    this.toastsSubject.next(
      this.toastsSubject.getValue().filter((toast) => toast.id !== id),
    );
  }
}

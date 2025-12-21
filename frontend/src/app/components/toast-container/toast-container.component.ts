import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { Toast } from '../../models/toast.interface';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [AsyncPipe, ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private subscription = new Subscription();

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.subscribeForToasts();
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

  private subscribeForToasts(): void {
    this.subscription.add(
      this.toastService.get
        .pipe(
          tap((toast) => {
            if (toast) {
              this.toastsSubject.next([
                ...this.toastsSubject.getValue(),
                toast,
              ]);
            }
          }),
        )
        .subscribe(),
    );
  }
}

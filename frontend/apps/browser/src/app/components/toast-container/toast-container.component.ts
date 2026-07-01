import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastComponent } from '../toast/toast.component';
import { Toast } from '../../models/toast.interface';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  readonly toasts = signal<Toast[]>([]);

  private readonly toastService = inject(ToastService);

  constructor() {
    this.toastService.get.pipe(takeUntilDestroyed()).subscribe((toast) => {
      this.toasts.update((current) => [...current, toast]);
    });
  }

  removeToast(id: string): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }
}

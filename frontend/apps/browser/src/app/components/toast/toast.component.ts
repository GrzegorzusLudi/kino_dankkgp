import {
  AfterViewInit,
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { ThemedDirective } from 'theme';
import { NgStyle } from '@angular/common';
import { TextComponent } from 'text';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation,
  faCircleInfo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { interval, Subscription, take } from 'rxjs';

// TODO Remove timeouts, use observables

@Component({
  selector: 'app-toast',
  imports: [FontAwesomeModule, NgStyle, TextComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './toast.component.html',
  styleUrls: [
    './toast.aero.component.scss',
    './toast.flat.component.scss',
  ],
})
export class ToastComponent implements OnInit, AfterViewInit, OnDestroy {
  title = input('');
  message = input('');
  variant = input<'info' | 'success' | 'danger'>('danger');
  timeout = input(5000);

  close = output<void>();

  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faCircleInfo = faCircleInfo;
  faXmark = faXmark;

  barWidth = '100%';
  transitionDuration = '0s';

  private subscription?: Subscription;

  ngOnInit(): void {
    this.initializeCloseTimeout();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.transitionDuration = `${this.timeout()}ms`;
      this.barWidth = '0%';
    }, 25);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  dismiss(): void {
    this.subscription?.unsubscribe();
    this.close.emit();
  }

  focus(): void {
    this.subscription?.unsubscribe();
    this.transitionDuration = '0s';
    this.barWidth = '100%';
  }

  blur(): void {
    setTimeout(() => {
      this.transitionDuration = `${this.timeout()}ms`;
      this.barWidth = '0%';
    }, 10);
    this.initializeCloseTimeout();
  }

  private initializeCloseTimeout(): void {
    this.subscription?.unsubscribe();
    this.subscription = interval(this.timeout())
      .pipe(take(1))
      .subscribe(() => {
        this.close.emit();
      });
  }
}

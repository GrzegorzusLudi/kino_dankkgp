import {
  AfterViewInit,
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ThemedDirective } from 'theme';
import { NgStyle } from '@angular/common';
import { ButtonComponent } from 'button';
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
  imports: [ButtonComponent, FontAwesomeModule, NgStyle, TextComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.aero.component.scss', './toast.flat.component.scss'],
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

  protected readonly barWidth = signal('100%');
  protected readonly transitionDuration = signal('0s');

  private subscription?: Subscription;

  ngOnInit(): void {
    this.initializeCloseTimeout();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.transitionDuration.set(`${this.timeout()}ms`);
      this.barWidth.set('0%');
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
    this.transitionDuration.set('0s');
    this.barWidth.set('100%');
  }

  blur(): void {
    setTimeout(() => {
      this.transitionDuration.set(`${this.timeout()}ms`);
      this.barWidth.set('0%');
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

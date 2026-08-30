import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription, timer } from 'rxjs';

import { ButtonComponent } from 'button';
import { TextComponent } from 'text';
import { ThemedDirective } from 'theme';
import {
  BAR_ANIMATION_RESTART_DELAY,
  BAR_ANIMATION_START_DELAY,
  DEFAULT_TOAST_TIMEOUT,
  EMPTY_BAR_WIDTH,
  FULL_BAR_WIDTH,
  NO_TRANSITION_DURATION,
} from './toast.consts';
import { ToastVariant } from '../../models/toast-variant.type';

@Component({
  selector: 'app-toast',
  imports: [ButtonComponent, FontAwesomeModule, NgStyle, TextComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.aero.component.scss', './toast.flat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly title = input('');
  readonly message = input('');
  readonly variant = input<ToastVariant>('danger');
  readonly timeout = input(DEFAULT_TOAST_TIMEOUT);

  readonly close = output<void>();

  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faTriangleExclamation = faTriangleExclamation;
  protected readonly faCircleInfo = faCircleInfo;
  protected readonly faXmark = faXmark;

  protected readonly barWidth = signal(FULL_BAR_WIDTH);
  protected readonly transitionDuration = signal(NO_TRANSITION_DURATION);

  private closeSubscription?: Subscription;
  private barSubscription?: Subscription;

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.scheduleClose();
      this.emptyBarAfter(BAR_ANIMATION_START_DELAY);
    });

    this.destroyRef.onDestroy(() => {
      this.closeSubscription?.unsubscribe();
      this.barSubscription?.unsubscribe();
    });
  }

  protected dismiss(): void {
    this.closeSubscription?.unsubscribe();
    this.close.emit();
  }

  protected focus(): void {
    this.closeSubscription?.unsubscribe();
    this.barSubscription?.unsubscribe();
    this.transitionDuration.set(NO_TRANSITION_DURATION);
    this.barWidth.set(FULL_BAR_WIDTH);
  }

  protected blur(): void {
    this.emptyBarAfter(BAR_ANIMATION_RESTART_DELAY);
    this.scheduleClose();
  }

  private scheduleClose(): void {
    this.closeSubscription?.unsubscribe();
    this.closeSubscription = timer(this.timeout()).subscribe(() =>
      this.close.emit(),
    );
  }

  private emptyBarAfter(delay: number): void {
    this.barSubscription?.unsubscribe();
    this.barSubscription = timer(delay).subscribe(() => {
      this.transitionDuration.set(`${this.timeout()}ms`);
      this.barWidth.set(EMPTY_BAR_WIDTH);
    });
  }
}

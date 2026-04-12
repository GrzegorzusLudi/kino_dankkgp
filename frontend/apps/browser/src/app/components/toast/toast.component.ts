import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { NgClass, NgStyle } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { interval, Subscription, take } from 'rxjs';

// TODO Remove timeouts, use observables

@Component({
  selector: 'app-toast',
  imports: [FontAwesomeModule, NgClass, NgStyle],
  templateUrl: './toast.component.html',
  styleUrls: [
    './toast.aero-dark.component.scss',
    './toast.aero-light.component.scss',
    './toast.dark.component.scss',
    './toast.light.component.scss',
  ],
})
export class ToastComponent
  extends ThemedDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() variant: 'info' | 'success' | 'danger' = 'danger';
  @Input() timeout = 5000;

  @Output() close = new EventEmitter<void>();

  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faCircleInfo = faCircleInfo;

  barWidth = '100%';
  transitionDuration = '0s';

  private subscription?: Subscription;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }

  ngOnInit(): void {
    this.initializeCloseTimeout();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.transitionDuration = `${this.timeout}ms`;
      this.barWidth = '0%';
    }, 25);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  focus(): void {
    this.subscription?.unsubscribe();
    this.transitionDuration = '0s';
    this.barWidth = '100%';
  }

  blur(): void {
    setTimeout(() => {
      this.transitionDuration = `${this.timeout}ms`;
      this.barWidth = '0%';
    }, 10);
    this.initializeCloseTimeout();
  }

  private initializeCloseTimeout(): void {
    this.subscription?.unsubscribe();
    this.subscription = interval(this.timeout)
      .pipe(take(1))
      .subscribe(() => {
        this.close.emit();
      });
  }
}

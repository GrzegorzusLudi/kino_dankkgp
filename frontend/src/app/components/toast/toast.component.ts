import { Component, Input } from '@angular/core';
import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck, faTriangleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toast',
  imports: [AsyncPipe, FontAwesomeModule, NgClass, NgIf],
  templateUrl: './toast.component.html',
  styleUrls: [
    './toast.aero-dark.component.scss',
    './toast.aero-light.component.scss',
    './toast.dark.component.scss',
    './toast.light.component.scss',
  ],
})
export class ToastComponent extends ThemedDirective {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() variant: 'info' | 'success' | 'danger' = 'danger'

  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faCircleInfo = faCircleInfo;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}

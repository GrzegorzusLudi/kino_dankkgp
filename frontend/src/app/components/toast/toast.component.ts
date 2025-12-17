import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [AsyncPipe, HeaderComponent, NgIf],
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

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}

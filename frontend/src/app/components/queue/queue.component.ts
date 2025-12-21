import { Component } from '@angular/core';
import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-queue',
  imports: [AsyncPipe, NgIf],
  templateUrl: './queue.component.html',
  styleUrls: [
    './queue.aero-dark.component.scss',
    './queue.aero-light.component.scss',
    './queue.dark.component.scss',
    './queue.light.component.scss',
  ],
})
export class QueueComponent extends ThemedDirective {
  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}

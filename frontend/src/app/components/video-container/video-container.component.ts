import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-video-container',
  imports: [AsyncPipe, NgClass, NgIf],
  templateUrl: './video-container.component.html',
  styleUrls: [
    './video-container.aero-dark.component.scss',
    './video-container.aero-light.component.scss',
    './video-container.dark.component.scss',
    './video-container.light.component.scss',
  ],
})
export class VideoContainerComponent extends ThemedDirective {
  @Input() title = '';
}

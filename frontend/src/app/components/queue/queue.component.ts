import { Component, Input } from '@angular/core';
import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { NgIf, NgClass, NgForOf, AsyncPipe } from '@angular/common';
import { Video } from '../../models/video.interface';
import { Queue } from '../../models/queue.interface';

@Component({
  selector: 'app-queue',
  imports: [AsyncPipe, NgClass, NgForOf, NgIf],
  templateUrl: './queue.component.html',
  styleUrls: [
    './queue.aero-dark.component.scss',
    './queue.aero-light.component.scss',
    './queue.dark.component.scss',
    './queue.light.component.scss',
  ],
})
export class QueueComponent extends ThemedDirective {
  @Input() queue?: Queue;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }

  trackByFn(index: number, item: Video) {
    return index + item.videoId;
  }
}

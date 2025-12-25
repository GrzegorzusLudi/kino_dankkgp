import { Component, Input } from '@angular/core';
import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { NgClass } from '@angular/common';
import { Video } from '../../models/video.interface';
import { Queue } from '../../models/queue.interface';
import { faTrash, faCircleUp, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-queue',
  imports: [ButtonComponent, DurationPipe, FontAwesomeModule, NgClass],
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

  faPlay = faPlay;
  faTrash = faTrash;
  faCircleUp = faCircleUp;

  focusedIndex: number = -1;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }

  trackByFn(index: number, item: Video) {
    return index + item.videoId;
  }

  focus(index: number) {
    this.focusedIndex = index;
  }

  blur(index: number) {
    if (this.focusedIndex === index) {
      this.focusedIndex = -1;
    }
  }
}

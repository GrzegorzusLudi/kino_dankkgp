import { Component, inject, Input } from '@angular/core';
import { THEME } from 'theme';
import { NgClass } from '@angular/common';
import { Video } from '../../models/video.interface';
import { Queue } from '../../models/queue.interface';
import { faTrash, faCircleUp, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { ButtonComponent } from 'button';

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
export class QueueComponent {
  protected readonly theme = inject(THEME);

  @Input() queue?: Queue;

  faPlay = faPlay;
  faTrash = faTrash;
  faCircleUp = faCircleUp;

  focusedIndex: number = -1;

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

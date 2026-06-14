import { Component, input } from '@angular/core';
import { ThemedDirective } from 'theme';
import { Video } from '../../models/video.interface';
import { Queue } from '../../models/queue.interface';
import { faTrash, faCircleUp, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { ButtonComponent } from 'button';
import { TextComponent } from 'text';

@Component({
  selector: 'app-queue',
  imports: [ButtonComponent, DurationPipe, FontAwesomeModule, TextComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.aero.component.scss', './queue.flat.component.scss'],
})
export class QueueComponent {
  queue = input<Queue>();

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

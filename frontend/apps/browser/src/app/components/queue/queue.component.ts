import { Component, inject, input, signal } from '@angular/core';
import { ThemedDirective } from 'theme';
import { Video } from '../../models/video.interface';
import { Queue } from '../../models/queue.interface';
import { faTrash, faCircleUp, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { match } from 'ts-pattern';
import { noop } from 'lodash-es';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { ButtonComponent } from 'button';
import { TextComponent } from 'text';
import { TooltipDirective } from 'tooltip';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-queue',
  imports: [
    ButtonComponent,
    DurationPipe,
    FontAwesomeModule,
    TextComponent,
    TooltipDirective,
  ],
  hostDirectives: [ThemedDirective],
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.aero.component.scss', './queue.flat.component.scss'],
})
export class QueueComponent {
  queue = input<Queue>();

  faPlay = faPlay;
  faTrash = faTrash;
  faCircleUp = faCircleUp;

  protected readonly focusedIndex = signal(-1);

  private readonly apiService = inject(ApiService);

  trackByFn(index: number, item: Video) {
    return index + item.videoId;
  }

  focus(index: number) {
    this.focusedIndex.set(index);
  }

  blur(index: number) {
    match(this.focusedIndex() === index)
      .with(true, () => this.focusedIndex.set(-1))
      .otherwise(noop);
  }

  voteToMoveUp(item: Video): void {
    this.apiService.voteToMoveVideoUp(item.id, !item.move_up_voting.you_voted);
  }

  voteToRemove(item: Video): void {
    this.apiService.voteToSkipVideo(item.id, !item.skip_voting.you_voted);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUp, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { noop } from 'lodash-es';
import { match } from 'ts-pattern';

import { ButtonComponent } from 'button';
import { TextComponent } from 'text';
import { ThemedDirective } from 'theme';
import { TooltipDirective } from 'tooltip';
import { NO_FOCUSED_INDEX } from './queue.consts';
import { Queue } from '../../models/queue.interface';
import { Video } from '../../models/video.interface';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueComponent {
  readonly queue = input<Queue>();

  protected readonly faPlay = faPlay;
  protected readonly faTrash = faTrash;
  protected readonly faCircleUp = faCircleUp;

  protected readonly focusedIndex = signal(NO_FOCUSED_INDEX);

  private readonly apiService = inject(ApiService);

  protected trackByFn(index: number, item: Readonly<Video>): string {
    return `${index}:${item.videoId}`;
  }

  protected focus(index: number): void {
    this.focusedIndex.set(index);
  }

  protected blur(index: number): void {
    match(this.focusedIndex() === index)
      .with(true, () => this.focusedIndex.set(NO_FOCUSED_INDEX))
      .otherwise(noop);
  }

  protected voteToMoveUp(item: Readonly<Video>): void {
    this.apiService.voteToMoveVideoUp(item.id, !item.move_up_voting.you_voted);
  }

  protected voteToRemove(item: Readonly<Video>): void {
    this.apiService.voteToSkipVideo(item.id, !item.skip_voting.you_voted);
  }
}

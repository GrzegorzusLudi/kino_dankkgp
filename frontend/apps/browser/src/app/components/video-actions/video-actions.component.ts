import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faForwardStep,
  faPlus,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { attempt, isError, trimStart } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { ButtonComponent } from 'button';
import { InputComponent } from 'input';
import { ThemedDirective } from 'theme';
import { VerticalSeparatorComponent } from 'vertical-separator';
import {
  INVALID_URL_TOAST_MESSAGE,
  INVALID_URL_TOAST_TITLE,
  PATH_SEPARATOR,
  URL_CONTROL_NAME,
  YOUTUBE_HOSTNAME,
  YOUTUBE_SHORT_HOSTNAME,
  YOUTUBE_VIDEO_ID_QUERY_PARAM,
  YOUTUBE_WATCH_URL_PREFIX,
} from './video-actions.consts';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';

const { string, when } = P;

@Component({
  selector: 'app-video-actions',
  imports: [
    ButtonComponent,
    FontAwesomeModule,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    VerticalSeparatorComponent,
  ],
  hostDirectives: [ThemedDirective],
  templateUrl: './video-actions.component.html',
  styleUrls: [
    './video-actions.aero.component.scss',
    './video-actions.flat.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoActionsComponent {
  protected readonly faPlus = faPlus;
  protected readonly faRotate = faRotate;
  protected readonly faForwardStep = faForwardStep;

  protected readonly form = new FormGroup({
    [URL_CONTROL_NAME]: new FormControl(''),
  });

  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  protected addVideoToQueue(): void {
    const url = this.form.get(URL_CONTROL_NAME)?.value?.trim();

    match(this.extractYouTubeVideoId(url))
      .with(string, (id) => {
        this.apiService.addVideoToQueue(`${YOUTUBE_WATCH_URL_PREFIX}${id}`);
        this.form.get(URL_CONTROL_NAME)?.setValue('');
      })
      .otherwise(() =>
        this.toastService.next({
          title: INVALID_URL_TOAST_TITLE,
          message: INVALID_URL_TOAST_MESSAGE,
          variant: 'danger',
        }),
      );
  }

  private extractYouTubeVideoId(url: string | undefined): string | null {
    return match(attempt(() => new URL(url ?? '')))
      .with(when(isError), () => null)
      .otherwise((parsed) =>
        match(parsed)
          .with({ hostname: string.includes(YOUTUBE_HOSTNAME) }, (value) =>
            value.searchParams.get(YOUTUBE_VIDEO_ID_QUERY_PARAM),
          )
          .with({ hostname: YOUTUBE_SHORT_HOSTNAME }, (value) =>
            trimStart(value.pathname, PATH_SEPARATOR),
          )
          .otherwise(() => null),
      );
  }
}

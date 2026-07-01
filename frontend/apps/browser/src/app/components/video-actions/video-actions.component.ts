import { Component, inject, OnInit } from '@angular/core';

import { ThemedDirective } from 'theme';
import { ButtonComponent } from 'button';
import { InputComponent } from 'input';
import { VerticalSeparatorComponent } from 'vertical-separator';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { match, P } from 'ts-pattern';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faRotate,
  faForwardStep,
} from '@fortawesome/free-solid-svg-icons';

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
})
export class VideoActionsComponent implements OnInit {
  protected form!: FormGroup;

  faPlus = faPlus;
  faRotate = faRotate;
  faForwardStep = faForwardStep;

  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.form = this.createVideoActionsForm();
  }

  addVideoToQueue(): void {
    const url = this.form.value.url?.trim();
    const videoId = this.extractYouTubeVideoId(url);

    match(videoId)
      .with(P.string, (id) => {
        this.apiService.addVideoToQueue(
          `https://www.youtube.com/watch?v=${id}`,
        );
        this.form.get('url')?.setValue('');
      })
      .otherwise(() => {
        this.toastService.next({
          title: 'Invalid URL',
          message: 'Invalid YouTube URL',
          variant: 'danger',
        });
      });
  }

  private createVideoActionsForm(): FormGroup {
    return new FormGroup({
      url: new FormControl(''),
    });
  }

  private extractYouTubeVideoId(url: string | undefined): string | null {
    try {
      const urlObj = new URL(url ?? '');

      return match(urlObj)
        .with({ hostname: P.string.includes('youtube.com') }, (value) =>
          value.searchParams.get('v'),
        )
        .with({ hostname: 'youtu.be' }, (value) => value.pathname.substring(1))
        .otherwise(() => null);
    } catch {
      return null;
    }
  }
}

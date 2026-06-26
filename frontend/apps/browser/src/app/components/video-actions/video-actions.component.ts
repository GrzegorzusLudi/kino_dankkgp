import { Component, OnInit } from '@angular/core';

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

  constructor(
    private readonly apiService: ApiService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  addVideoToQueue(): void {
    const url = this.form.value.url?.trim();

    const videoId = this.extractYouTubeVideoId(url);

    if (videoId) {
      this.apiService.addVideoToQueue(
        `https://www.youtube.com/watch?v=${videoId}`,
      );
      this.form.get('url')?.setValue('');
    } else {
      this.toastService.next({
        title: 'Invalid URL',
        message: 'Invalid YouTube URL',
        variant: 'danger',
      });
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      url: new FormControl(''),
    });
  }

  private extractYouTubeVideoId(url: string): string | null {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }

      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.substring(1);
      }

      return null;
    } catch {
      return null;
    }
  }
}

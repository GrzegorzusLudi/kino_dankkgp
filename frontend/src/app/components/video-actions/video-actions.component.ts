import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { VerticalSeparatorComponent } from '../vertical-separator/vertical-separator.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-video-actions',
  imports: [
    AsyncPipe,
    ButtonComponent,
    InputComponent,
    NgClass,
    NgIf,
    VerticalSeparatorComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './video-actions.component.html',
  styleUrls: [
    './video-actions.aero-dark.component.scss',
    './video-actions.aero-light.component.scss',
    './video-actions.dark.component.scss',
    './video-actions.light.component.scss',
  ],
})
export class VideoActionsComponent extends ThemedDirective implements OnInit {
  protected form!: FormGroup;

  constructor(protected override readonly themeService: ThemeService, private readonly apiService: ApiService) {
    super(themeService);
  }

  ngOnInit(): void {
    this.initForm();
  }

  addVideoToQueue(): void {
    const url = this.form.value.url?.trim();

    const videoId = this.extractYouTubeVideoId(url);

    if (videoId) {
      this.apiService.addVideoToQueue(`https://www.youtube.com/watch?v=${videoId}`);
      this.form.get('url')?.setValue('');
    } else {
      alert('Invalid YouTube URL'); // TODO toast
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

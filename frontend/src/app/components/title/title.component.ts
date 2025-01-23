import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Theme } from '../../models/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-title',
  imports: [NgClass, NgIf, AsyncPipe],
  templateUrl: './title.component.html',
  styleUrls: [
    './title.light.component.scss',
    './title.dark.component.scss',
    './title.aero-light.component.scss',
    './title.aero-dark.component.scss',
  ],
})
export class TitleComponent implements OnInit {
  protected theme!: Observable<Theme>;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
  }
}

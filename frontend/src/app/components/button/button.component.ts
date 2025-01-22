import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Theme } from '../../models/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-button',
  imports: [NgIf, NgClass, AsyncPipe],
  templateUrl: './button.component.html',
  styleUrls: [
    './button.light.component.scss',
    './button.dark.component.scss',
    './button.aero-light.component.scss',
    './button.aero-dark.component.scss',
  ],
})
export class ButtonComponent implements OnInit {
  protected theme!: Observable<Theme>;
  protected clicked = false;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
  }
}

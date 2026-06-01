import {
  Directive,
  effect,
  ElementRef,
  inject,
  Renderer2,
  Signal,
} from '@angular/core';

import { THEME } from './theme.token';

@Directive()
export class ThemedDirective {
  protected readonly theme: Signal<string> = inject(THEME);

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  private previousTheme: string | null = null;

  constructor() {
    effect(() => {
      const theme = this.theme();
      const firstChild = this.elementRef.nativeElement.firstElementChild;

      if (!firstChild) {
        return;
      }

      if (this.previousTheme) {
        this.renderer.removeClass(firstChild, this.previousTheme);
      }

      this.renderer.addClass(firstChild, theme);
      this.previousTheme = theme;
    });
  }
}

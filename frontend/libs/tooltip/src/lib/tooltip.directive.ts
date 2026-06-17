import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

import { ThemeService } from 'theme';

@Directive({
  selector: '[libTooltip]',
})
export class TooltipDirective implements OnDestroy {
  readonly libTooltip = input<string>('');
  readonly position = input<'top' | 'bottom' | 'left' | 'right'>('top');

  private tooltipElement: HTMLElement | null = null;

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly themeService = inject(ThemeService);

  @HostListener('mouseenter')
  show(): void {
    if (!this.libTooltip()) {
      return;
    }

    this.createTooltip();
  }

  @HostListener('mouseleave')
  hide(): void {
    this.destroyTooltip();
  }

  ngOnDestroy(): void {
    this.destroyTooltip();
  }

  private createTooltip(): void {
    this.destroyTooltip();

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.addClass(this.tooltipElement, this.position());
    this.renderer.addClass(this.tooltipElement, this.themeService.theme());

    const text = this.renderer.createText(this.libTooltip());

    this.renderer.appendChild(this.tooltipElement, text);
    this.renderer.appendChild(document.body, this.tooltipElement);

    this.positionTooltip();
  }

  private positionTooltip(): void {
    if (!this.tooltipElement) {
      return;
    }

    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    const isCustomElement = nativeEl.tagName.includes('-');
    const hostEl = isCustomElement
      ? ((nativeEl.firstElementChild ?? nativeEl) as HTMLElement)
      : nativeEl;
    const hostRect: DOMRect = hostEl.getBoundingClientRect();
    const tooltipRect: DOMRect = this.tooltipElement.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (this.position()) {
      case 'top':
        top = hostRect.top - tooltipRect.height - gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + gap;
        break;
    }

    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '9999');
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  private destroyTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}

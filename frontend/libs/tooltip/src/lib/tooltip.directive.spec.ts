import { Component } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipDirective } from './tooltip.directive';

@Component({
  template: `<button [libTooltip]="text" [position]="position">Hover</button>`,
  imports: [TooltipDirective],
})
class HostComponent {
  text = 'Tooltip text';
  position: 'top' | 'bottom' | 'left' | 'right' = 'top';
}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement.querySelector('button');
  });

  afterEach(() => {
    document.querySelectorAll('.tooltip').forEach((el) => el.remove());
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('structure', () => {
    it('should not render a tooltip element by default', () => {
      expect(document.querySelector('.tooltip')).toBeNull();
    });
  });

  describe('default inputs', () => {
    it('should default position to top', () => {
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')?.classList).toContain('top');
    });
  });

  describe('libTooltip', () => {
    it('should render the tooltip text on mouseenter', () => {
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')?.textContent).toBe(
        'Tooltip text',
      );
    });

    it('should not show a tooltip when text is empty', () => {
      fixture.componentInstance.text = '';
      fixture.detectChanges();
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')).toBeNull();
    });

    it('should update the tooltip text when the input changes', () => {
      fixture.componentInstance.text = 'Updated text';
      fixture.detectChanges();
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')?.textContent).toBe(
        'Updated text',
      );
    });
  });

  describe('position', () => {
    it('should apply top class by default', () => {
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')?.classList).toContain('top');
    });

    it('should apply bottom class when position is bottom', () => {
      fixture.componentInstance.position = 'bottom';
      fixture.detectChanges();
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')?.classList).toContain('bottom');
    });

    it('should apply left class when position is left', () => {
      fixture.componentInstance.position = 'left';
      fixture.detectChanges();
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')?.classList).toContain('left');
    });

    it('should apply right class when position is right', () => {
      fixture.componentInstance.position = 'right';
      fixture.detectChanges();
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')?.classList).toContain('right');
    });
  });

  describe('user interactions', () => {
    it('should show the tooltip on mouseenter', () => {
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')).not.toBeNull();
    });

    it('should hide the tooltip on mouseleave', () => {
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      host.dispatchEvent(new Event('mouseleave'));
      fixture.detectChanges();
      expect(document.querySelector('.tooltip')).toBeNull();
    });

    it('should replace the tooltip when mouseenter fires again', () => {
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      host.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(document.querySelectorAll('.tooltip').length).toBe(1);
    });
  });
});

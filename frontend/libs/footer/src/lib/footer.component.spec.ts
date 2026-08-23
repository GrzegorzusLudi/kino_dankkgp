import { Component } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

@Component({
  template: '<lib-footer>Projected Text</lib-footer>',
  imports: [FooterComponent],
})
class HostComponent {}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let footer: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    footer = fixture.nativeElement.querySelector('.footer');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('structure', () => {
    it('should render the footer container element', () => {
      expect(footer).not.toBeNull();
    });
  });

  describe('content projection', () => {
    let hostFixture: ComponentFixture<HostComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();
    });

    it('should project content into the footer', () => {
      const projected: HTMLElement =
        hostFixture.nativeElement.querySelector('.footer');
      expect(projected.textContent).toContain('Projected Text');
    });
  });
});

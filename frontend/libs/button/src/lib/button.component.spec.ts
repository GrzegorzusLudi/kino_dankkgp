import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should default variant to primary', () => {
      expect(component.variant()).toBe('primary');
    });

    it('should default height to medium', () => {
      expect(component.height()).toBe('medium');
    });
  });

  describe('variant', () => {
    it('should apply primary class by default', () => {
      expect(button.classList).toContain('primary');
    });

    it('should apply ghost class when variant is ghost', () => {
      fixture.componentRef.setInput('variant', 'ghost');
      fixture.detectChanges();
      expect(button.classList).toContain('ghost');
      expect(button.classList).not.toContain('primary');
    });
  });

  describe('height', () => {
    it('should apply medium class by default', () => {
      expect(button.classList).toContain('medium');
    });

    it('should apply small class when height is small', () => {
      fixture.componentRef.setInput('height', 'small');
      fixture.detectChanges();
      expect(button.classList).toContain('small');
      expect(button.classList).not.toContain('medium');
    });
  });

  describe('click interaction', () => {
    it('should add clicked class on click', () => {
      button.click();
      fixture.detectChanges();
      expect(button.classList).toContain('clicked');
    });

    it('should remove clicked class on blur', () => {
      button.click();
      fixture.detectChanges();
      button.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(button.classList).not.toContain('clicked');
    });
  });
});

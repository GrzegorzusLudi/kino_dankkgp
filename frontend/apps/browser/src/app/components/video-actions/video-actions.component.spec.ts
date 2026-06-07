import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { SOCKET } from '../../app.config';
import { VideoActionsComponent } from './video-actions.component';

describe('VideoActionsComponent', () => {
  let component: VideoActionsComponent;
  let fixture: ComponentFixture<VideoActionsComponent>;

  beforeEach(async () => {
    const mockSocket = { emit: vi.fn(), on: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [VideoActionsComponent],
      providers: [
        { provide: SOCKET, useValue: mockSocket },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

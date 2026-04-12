import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SOCKET } from '../../app.config';
import { VideoActionsComponent } from './video-actions.component';

describe('VideoActionsComponent', () => {
  let component: VideoActionsComponent;
  let fixture: ComponentFixture<VideoActionsComponent>;

  beforeEach(async () => {
    const mockSocket = jasmine.createSpyObj('Socket', ['emit', 'on']);

    await TestBed.configureTestingModule({
      imports: [VideoActionsComponent],
      providers: [{ provide: SOCKET, useValue: mockSocket }],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoActionsComponent } from './video-actions.component';

describe('VideoActionsComponent', () => {
  let component: VideoActionsComponent;
  let fixture: ComponentFixture<VideoActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

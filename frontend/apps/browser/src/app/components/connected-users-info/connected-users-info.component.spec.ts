import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedUsersInfoComponent } from './connected-users-info.component';

describe('ConnectedUsersInfoComponent', () => {
  let component: ConnectedUsersInfoComponent;
  let fixture: ComponentFixture<ConnectedUsersInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedUsersInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectedUsersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

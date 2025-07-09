import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPoliciesNotificationComponent } from './no-policies-notification.component';

describe('NoPoliciesNotificationComponent', () => {
  let component: NoPoliciesNotificationComponent;
  let fixture: ComponentFixture<NoPoliciesNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoPoliciesNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoPoliciesNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

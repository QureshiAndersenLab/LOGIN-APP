import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesContainerComponent } from './policies-container.component';

describe('PoliciesContainerComponent', () => {
  let component: PoliciesContainerComponent;
  let fixture: ComponentFixture<PoliciesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliciesContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliciesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

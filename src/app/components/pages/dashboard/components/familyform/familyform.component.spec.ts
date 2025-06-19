import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FamilyformComponent } from './familyform.component';
import { MOCK_TRANSLATE_SERVICE_PROVIDER } from '@shared/utils';
import { By } from '@angular/platform-browser';
import { provideTestConfig } from '@shared/utils/provide-test-config';

describe('FamilyformComponent', () => {
  let component: FamilyformComponent;
  let fixture: ComponentFixture<FamilyformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyformComponent],
      providers: [...provideTestConfig([MOCK_TRANSLATE_SERVICE_PROVIDER])],
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new member form group on clicking add button', fakeAsync(() => {
    const addMemberSpy = spyOn(component, 'addMember').and.callThrough();

    const addButton = fixture.debugElement.query(
      By.css('[data-testId="add-member-btn"]')
    );
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(addMemberSpy).toHaveBeenCalled();

    const memberInputs = fixture.debugElement.queryAll(
      By.css('[data-testId="member-div"]')
    );
    expect(memberInputs.length).toBe(2);
  }));

  it('should not show delete button when only one member exists', () => {
    const deleteButton = fixture.debugElement.query(
      By.css('[data-testId="remove-member-btn"]')
    );
    expect(deleteButton).toBeNull();
  });

  it('should remove a member form group on clicking delete', fakeAsync(() => {
    const addMemberSpy = spyOn(component, 'addMember').and.callThrough();
    const removeMemberSpy = spyOn(component, 'removeMember').and.callThrough();

    const addButton = fixture.debugElement.query(
      By.css('[data-testId="add-member-btn"]')
    );
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const memberInputs1 = fixture.debugElement.queryAll(
      By.css('[data-testId="member-div"]')
    );
    tick(300);

    expect(addMemberSpy).toHaveBeenCalled();
    expect(memberInputs1.length).toBe(2);

    let deleteButtons = fixture.debugElement.queryAll(
      By.css('[data-testId="remove-member-btn"]')
    );
    expect(deleteButtons.length).toBeGreaterThan(0);

    deleteButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(removeMemberSpy).toHaveBeenCalled();

    const memberInputs2 = fixture.debugElement.queryAll(
      By.css('[data-testId="member-div"]')
    );
    expect(memberInputs2.length).toBe(1);
  }));

  it('should display the correct calculated total price', fakeAsync(() => {
    const calculateTotalSpy = spyOn(
      component,
      'calculateTotal'
    ).and.callThrough();

    const dateInput = fixture.debugElement.query(By.css('input')).nativeElement;
    dateInput.value = '2000-01-01';
    dateInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const amountInput = fixture.debugElement.query(
      By.css('input[type="number"]')
    ).nativeElement;
    amountInput.value = 100;
    amountInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(500);

    expect(calculateTotalSpy).toHaveBeenCalled();
    expect(component.totalPrice).toEqual(50);
  }));
});

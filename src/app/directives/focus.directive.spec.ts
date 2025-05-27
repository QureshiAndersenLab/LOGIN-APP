import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FocusDirective } from './focus.directive';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-test',
  imports: [FocusDirective],
  template: `<input focus />`,
})
class TestComponent {}

describe('FocusDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, FocusDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.query(By.directive(FocusDirective));
  });

  it('should focus the element after view init', () => {
    const focusSpy = spyOn(inputElement.nativeElement, 'focus');

    fixture.detectChanges();

    expect(focusSpy).toHaveBeenCalled();
  });
});

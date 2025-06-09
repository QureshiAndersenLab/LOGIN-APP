import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpInputDirective } from './otp-input.directive';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const OTP_LENGTH = 3;

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, OtpInputDirective],
  template: `
    <form [formGroup]="otpForm">
      <div otp-group class="flex gap-2 justify-between">
        @for (ctrl of otpControls; track $index) {
        <input
          type="text"
          maxlength="1"
          formControlName="{{ ctrl }}"
          [index]="$index"
          [formName]="otpForm"
          appOtpInput
        />
        }
      </div>
    </form>
  `,
})
class TestHostComponent {
  otpForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group(
      Object.fromEntries(
        Array.from({ length: OTP_LENGTH }).map((_, i) => [i.toString(), ['']])
      )
    );
  }

  get otpControls(): string[] {
    return Object.keys(this.otpForm.controls);
  }
}

describe('OtpInputDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputs: HTMLInputElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    inputs = fixture.debugElement
      .queryAll(By.directive(OtpInputDirective))
      .map((el) => el.nativeElement);
  });

  it('should clear value if non-digit entered', () => {
    const input = inputs[0];
    input.value = 'x';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('should move to next input on valid digit', () => {
    const input0 = inputs[0];
    const input1 = inputs[1];
    spyOn(input1, 'focus');

    input0.value = '5';
    input0.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input1.focus).toHaveBeenCalled();
  });

  it('should move to previous input on backspace if empty', () => {
    const input1 = inputs[1];
    const input0 = inputs[0];
    spyOn(input0, 'focus');

    input1.value = '';
    input1.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(input0.focus).toHaveBeenCalled();
  });

  it('should not move back if input is not empty', () => {
    const input1 = inputs[1];
    const input0 = inputs[0];
    input1.value = '9';
    spyOn(input0, 'focus');

    input1.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(input0.focus).not.toHaveBeenCalled();
  });

  it('should paste digits into inputs and focus next', () => {
    const input0 = inputs[0];
    const input2 = inputs[2];
    spyOn(input2, 'focus');

    const pasteEvent = new Event('paste') as ClipboardEvent;
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: () => '789',
      },
    });

    input0.dispatchEvent(pasteEvent);
    fixture.detectChanges();

    const form = fixture.componentInstance.otpForm;

    expect(form.get('0')?.value).toBe('7');
    expect(form.get('1')?.value).toBe('8');
    expect(form.get('2')?.value).toBe('9');
    expect(input2.focus).toHaveBeenCalled();
  });

  it('should ignore invalid pasted value', () => {
    const input0 = inputs[0];
    const form = fixture.componentInstance.otpForm;

    const pasteEvent = new Event('paste') as ClipboardEvent;
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: () => 'abc',
      },
    });

    input0.dispatchEvent(pasteEvent);
    fixture.detectChanges();

    expect(form.get('0')?.value).toBe('');
    expect(form.get('1')?.value).toBe('');
    expect(form.get('2')?.value).toBe('');
  });
});

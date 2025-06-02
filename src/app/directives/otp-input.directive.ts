import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  input,
  inject,
} from '@angular/core';
import { FormGroup, NgControl } from '@angular/forms';
import { OTPService } from '@services';

@Directive({
  selector: '[appOtpInput]',
})
export class OtpInputDirective {
  readonly formName = input.required<FormGroup>();
  readonly index = input.required<number>();
  readonly #el = inject(ElementRef<HTMLInputElement>);
  readonly #renderer = inject(Renderer2);
  readonly #control = inject(NgControl);
  readonly #OTPService = inject(OTPService);

  @HostListener('input')
  onInput(): void {
    const inputElement = this.#el.nativeElement;
    const value = inputElement.value;

    if (!/^\d$/.test(value)) {
      this.#renderer.setProperty(inputElement, 'value', '');
      this.#control.control?.setValue('');
      return;
    }

    const allInputs = this.#getInputs();

    const idx = this.index();
    if (idx < allInputs.length - 1) {
      const nextInput = allInputs[idx + 1] as HTMLInputElement;
      nextInput.focus();
    }

    if (idx === allInputs.length - 1) {
      const values = allInputs.map((input) => input.value).join('');
      this.#OTPService.validateOTP(values);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.#el.nativeElement.value) {
      const allInputs = this.#getInputs();

      const idx = this.index();

      if (idx > 0) {
        const prevInput = allInputs[idx - 1] as HTMLInputElement;
        prevInput.focus();
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pastedTxt: string = event.clipboardData?.getData('text') ?? '';

    if (!/^\d+$/.test(pastedTxt)) return;

    const allInputs = this.#getInputs();

    const chars = pastedTxt.slice(0, allInputs.length).split('');
    chars.forEach((ch, idx) => {
      const ctrlKey = String(idx);
      this.formName().get(ctrlKey)?.setValue(ch);
    });

    const firstEmptyIndex =
      chars.length < allInputs.length ? chars.length : allInputs.length - 1;

    allInputs[firstEmptyIndex].focus();
  }

  #getInputs(): HTMLInputElement[] {
    const parent = this.#el.nativeElement.closest('[otp-group]');
    return Array.from(parent?.querySelectorAll('input'));
  }
}

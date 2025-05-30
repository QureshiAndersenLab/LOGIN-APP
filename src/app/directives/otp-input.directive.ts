import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  input,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOtpInput]',
})
export class OtpInputDirective {
  readonly index = input.required<number>();

  readonly #el = inject(ElementRef<HTMLInputElement>);
  readonly #renderer = inject(Renderer2);
  readonly #control = inject(NgControl);

  @HostListener('input')
  onInput(): void {
    const inputElement = this.#el.nativeElement;
    const value = inputElement.value;

    if (!/^\d$/.test(value)) {
      this.#renderer.setProperty(inputElement, 'value', '');
      this.#control.control?.setValue('');
      return;
    }

    const parent = this.#el.nativeElement.closest('[otp-group]');
    const allInputs = Array.from(parent?.querySelectorAll('input') ?? []);

    const idx = this.index();
    if (idx < allInputs.length - 1) {
      const nextInput = allInputs[idx + 1] as HTMLInputElement;
      nextInput.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.#el.nativeElement.value) {
      const parent = this.#el.nativeElement.closest('[otp-group]');
      const allInputs = parent.querySelectorAll('input');

      const idx = this.index();

      if (idx > 0) {
        const prevInput = allInputs[idx - 1] as HTMLInputElement;
        prevInput.focus();
      }
    }
  }
}

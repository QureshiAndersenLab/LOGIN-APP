import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[focus]',
})
export class FocusDirective implements AfterViewInit {
  readonly #el = inject(ElementRef);

  ngAfterViewInit(): void {
    this.#el.nativeElement.focus();
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Language } from '@shared/constants';
import { I18nService } from '@services';

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent {
  readonly #i18nService = inject(I18nService);
  readonly #elementRef = inject(ElementRef);

  readonly showDropdown = signal(false);

  readonly currentLanguage = this.#i18nService.currentLanguage;
  readonly availableLanguages = this.#i18nService.availableLanguages;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.#elementRef.nativeElement.contains(event.target as Node)) {
      this.showDropdown.set(false);
    }
  }

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.showDropdown.set(false);
  }

  toggleDropdown(): void {
    this.showDropdown.update((show) => !show);
  }

  async selectLanguage(language: Language): Promise<void> {
    await this.#i18nService.setLanguage(language);
    this.showDropdown.set(false);
  }
}

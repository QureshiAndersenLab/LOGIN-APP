import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorComponent, NavbarComponent } from '@components';
import { DEFAULT_LANGUAGE } from '@shared/constants';
import { MOCK_TRANSLATE_SERVICE_PROVIDER } from '@shared/utils';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, LanguageSelectorComponent],
      providers: [MOCK_TRANSLATE_SERVICE_PROVIDER],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create NavbarComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo with correct src and alt attributes', () => {
    const navbar = fixture.nativeElement;
    const logo = navbar.querySelector('[data-testId="nav-logo"]');
    expect(logo).toBeTruthy();
    expect(logo.getAttribute('src')).toContain('logo.png');
    expect(logo.getAttribute('alt')).toBe('Logo');
  });

  it('should render default selected language', () => {
    const navbar = fixture.nativeElement;
    const selectedLang = navbar
      .querySelector('[data-testId="selected-lang"]')
      .textContent.trim();
    expect(selectedLang).toBe(DEFAULT_LANGUAGE);
  });
});

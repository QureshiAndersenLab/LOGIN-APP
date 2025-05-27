import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create FooterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo with correct src and alt attributes', () => {
    const footer = fixture.nativeElement;
    const logoElement = footer.querySelector('[data-testId="footer-logo"]');
    expect(logoElement).toBeTruthy();
    expect(logoElement.getAttribute('src')).toContain('logo.png');
    expect(logoElement.getAttribute('alt')).toBe('Logo');
  });

  it('should render all footer links', () => {
    const footer = fixture.nativeElement;
    const linkElements = footer.querySelectorAll('a');
    expect(linkElements.length).toBe(component.footerLinks.length);
  });

  it('should render correct link texts', () => {
    const footer = fixture.nativeElement;
    const linkElements = footer.querySelectorAll('a');

    linkElements.forEach((el: HTMLElement, index: number) => {
      const textContent = el.textContent?.trim();
      const expectedText: string = component.footerLinks[index].name;
      expect(textContent).toBe(expectedText);
    });
  });
});

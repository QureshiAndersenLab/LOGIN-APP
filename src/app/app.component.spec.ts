import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { KANYE_API_URL } from './app.config';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: KANYE_API_URL,
          useValue: 'https://mock.kanye.rest',
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the Insurance Lady image with correct details', () => {
    const element = fixture.nativeElement;
    const sideImage = element.querySelector(
      '[data-testId="insurance-lady-img"] img'
    );
    expect(sideImage).toBeTruthy();
    expect(sideImage.getAttribute('src')).toContain('login');
    expect(sideImage.getAttribute('alt')).toBe('Insurance Lady');
  });

  it('should render welcome and instructions', () => {
    const welcomeText = fixture.nativeElement.querySelector('h2');
    expect(welcomeText.textContent).toContain('Welcome');

    const description = fixture.debugElement.nativeElement.querySelector('p');
    expect(description.textContent).toContain(
      `Your complete insurance hub – manage your policies, file claims, and discover customized coverage solutions with simplicity`
    );
  });

  it('should call goBack()', () => {
    let goBackSpy = spyOn(component, 'goBack');
    const backBtn = fixture.debugElement.query(By.css('button[type="button"]'));
    backBtn.triggerEventHandler('click', null);
    expect(goBackSpy).toHaveBeenCalled();
  });
});

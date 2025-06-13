import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { createMockTranslateServiceWithTranslations } from '@shared/utils';
import { TranslateService } from '@ngx-translate/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const mockTranslateService = createMockTranslateServiceWithTranslations({
    'pages.dashboard.welcome': 'Welcome to Allianz!',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome text', () => {
    const welcomeTxt = fixture.nativeElement.querySelector('p').textContent;
    expect(welcomeTxt).toBe('Welcome to Allianz!');
  });
});

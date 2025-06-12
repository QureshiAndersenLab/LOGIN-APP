import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyformComponent } from './familyform.component';
import { createMockTranslateServiceWithTranslations } from '@shared/utils';
import { TranslateService } from '@ngx-translate/core';

describe('FamilyformComponent', () => {
  let component: FamilyformComponent;
  let fixture: ComponentFixture<FamilyformComponent>;

  const mockTranslateService = createMockTranslateServiceWithTranslations({
    'common.loading': 'Loading...',
    'pages.login.invalidEmail': 'Please enter a valid email address.',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyformComponent],
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

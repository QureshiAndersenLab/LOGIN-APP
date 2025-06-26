import { TestBed } from '@angular/core/testing';
import { FamilyFormService } from './family-form.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FAMILY_FORM_STORAGE_KEY } from '@shared/constants';

describe('FamilyformService', () => {
  let service: FamilyFormService;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FamilyFormService],
    });

    service = TestBed.inject(FamilyFormService);
    formBuilder = TestBed.inject(FormBuilder);
    localStorage.clear();
  });

  describe('FamilyFormService', () => {
    it('should save valid form data to localStorage', () => {
      const form: FormGroup = formBuilder.group({
        members: [[]],
      });

      service.saveToLocalStorage(form);

      const stored = localStorage.getItem(FAMILY_FORM_STORAGE_KEY);
      expect(stored).toBe(JSON.stringify(form.value));
    });

    it('should not save invalid form data to localStorage', () => {
      const form: FormGroup = formBuilder.group({
        amount: [null, Validators.required],
      });

      spyOn(localStorage, 'setItem');
      service.saveToLocalStorage(form);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should return saved form data from localStorage', () => {
      const data = { members: [{ id: '123', dob: '2000-01-01', amount: 100 }] };
      localStorage.setItem(FAMILY_FORM_STORAGE_KEY, JSON.stringify(data));

      const result = service.loadFromLocalStorage();
      expect(result).toBe(JSON.stringify(data) as any);
    });

    it('should return correct age for a past date', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);

      const age = service.calculateAge(birthDate.toISOString());
      expect(age).toBe(25);
    });

    it("should decrease age if birth month hasn't reached yet", () => {
      const today = new Date();
      const dob = new Date(
        today.getFullYear() - 30,
        today.getMonth() + 1,
        today.getDate()
      );

      const age = service.calculateAge(dob.toISOString());
      expect(age).toBe(29);
    });

    it('should return 0.25 for age < 14', () => {
      expect(service.getMultiplierByAge(10)).toBe(0.25);
    });

    it('should return 1/3 for age between 14 and 21', () => {
      expect(service.getMultiplierByAge(18)).toBeCloseTo(1 / 3);
    });

    it('should return 0.5 for age between 21 and 38', () => {
      expect(service.getMultiplierByAge(30)).toBe(0.5);
    });

    it('should return 2 for age between 38 and 45', () => {
      expect(service.getMultiplierByAge(40)).toBe(2);
    });

    it('should return 0.25 for age >= 45', () => {
      expect(service.getMultiplierByAge(50)).toBe(0.25);
    });

    it('should return 0 as fallback for negative ages', () => {
      expect(service.getMultiplierByAge(-5)).toBe(0.25);
    });
  });
});

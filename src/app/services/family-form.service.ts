import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FAMILY_FORM_STORAGE_KEY } from '@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class FamilyFormService {
  saveToLocalStorage(data: FormGroup): void {
    if (data.invalid) return;
    //can you pls create a localStorage service wrapper?
    localStorage.setItem(FAMILY_FORM_STORAGE_KEY, JSON.stringify(data.value));
  }

  loadFromLocalStorage(): string {
    return localStorage.getItem(FAMILY_FORM_STORAGE_KEY) ?? '';
  }

  calculateAge(dob: string): number {
    if (!dob) return 0;

    const today = new Date();
    const birthDate = new Date(dob);

    const hasMonthReached = today.getMonth() - birthDate.getMonth();
    const hasDateReached = today.getDate() < birthDate.getDate();

    let age = today.getFullYear() - birthDate.getFullYear();

    if (hasMonthReached < 0 || (hasMonthReached === 0 && hasDateReached)) age--;

    return age;
  }

  getMultiplierByAge(age: number): number {
    if (age < 14) return 0.25;
    if (age >= 14 && age < 21) return 1 / 3;
    if (age >= 21 && age < 38) return 0.5;
    if (age >= 38 && age < 45) return 2;
    if (age >= 45) return 0.25;
    return 0;
  }
}

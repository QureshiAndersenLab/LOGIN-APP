import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { FamilyformService } from '@services';

interface IFamilyMember {
  id: string;
  dob: string;
  amount: string | null;
}

@Component({
  selector: 'allianz-familyform',
  templateUrl: './familyform.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    TranslateModule,
  ],
})
export class FamilyformComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #familyFormService = inject(FamilyformService);
  readonly #destroyRef = inject(DestroyRef);

  familyForm: FormGroup = this.#fb.group({
    members: this.#fb.array([]),
  });

  totalPrice: number = 0;

  ngOnInit(): void {
    const savedData = this.#familyFormService.loadFromLocalStorage();

    if (savedData) {
      JSON.parse(savedData).members.forEach((member: IFamilyMember) => {
        this.members.push(this.createMemberGroup(member));
      });
    } else {
      this.addMember();
    }

    this.familyForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.calculateTotal();
        this.#familyFormService.saveToLocalStorage(this.familyForm);
      });

    this.calculateTotal();
  }

  get members(): FormArray {
    return this.familyForm.get('members') as FormArray;
  }

  addMember(): void {
    this.members.push(this.createMemberGroup());
  }

  removeMember(index: number): void {
    this.members.removeAt(index);
    this.calculateTotal();
  }

  private createMemberGroup(member?: IFamilyMember): FormGroup {
    return this.#fb.group({
      id: [crypto.randomUUID()],
      dob: [member?.dob ?? '', [Validators.required]],
      amount: [
        member?.amount || null,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.members.controls.reduce((total, member) => {
      const dob: string = member.get('dob')?.value;
      const amt: number = Number(member.get('amount')?.value);

      if (!dob || isNaN(amt)) return total;

      const age: number = this.#familyFormService.calculateAge(dob);
      if (age < 0) return total;

      const mult: number = this.#familyFormService.getMultiplierByAge(age);
      return total + amt * mult;
    }, 0);
  }
}

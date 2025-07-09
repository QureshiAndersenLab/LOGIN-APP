import { Injectable } from '@angular/core';
import { ICreditCardPolicyGroup } from '@shared/models';
import { CREDIT_CARD_POLICIES } from 'app/data';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoliciesService {
  readonly #policies: ICreditCardPolicyGroup[] = CREDIT_CARD_POLICIES;

  getPolicies(): Observable<ICreditCardPolicyGroup[]> {
    return of(this.#policies).pipe(delay(1000));
  }
}

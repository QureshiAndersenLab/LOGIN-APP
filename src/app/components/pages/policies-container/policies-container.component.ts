import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ICreditCardPolicyGroup, IPoliciesGroupState } from '@shared/models';
import { PoliciesService } from '@services';
import { map, shareReplay, startWith, catchError, tap } from 'rxjs';
import { of } from 'rxjs';
import {
  CreditCardComponent,
  NoPoliciesNotificationComponent,
} from './components';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
  selector: 'app-policies-container',
  imports: [
    CommonModule,
    CreditCardComponent,
    NoPoliciesNotificationComponent,
    CdkAccordionModule,
  ],
  templateUrl: './policies-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliciesContainerComponent {
  readonly #policiesService = inject(PoliciesService);
  readonly isLoading = signal<boolean>(true);

  readonly policiesData = signal<IPoliciesGroupState>({
    active: [],
    inactive: [],
  });

  readonly noPolicies = computed(() => {
    const data = this.policiesData();
    return data.active.length === 0 && data.inactive.length === 0;
  });

  readonly policiesGroups$ = this.#policiesService.getPolicies().pipe(
    map((groups) => this.#groupPolicies(groups)),
    tap((result) => {
      this.policiesData.set(result);
      this.isLoading.set(false);
    }),
    catchError((error) => {
      console.error('Error loading policies:', error);
      this.isLoading.set(false);
      return of({ active: [], inactive: [] });
    }),
    startWith({ active: [], inactive: [] }),
    shareReplay(1)
  );

  readonly #groupPolicies = (
    groups: ICreditCardPolicyGroup[]
  ): IPoliciesGroupState => {
    return groups.reduce(
      (acc, group) => {
        const hasActivePolicies = group.policies.some(
          (policy) => policy.status === 'Active'
        );

        if (hasActivePolicies) {
          acc.active.push(group);
        } else {
          acc.inactive.push(group);
        }

        return acc;
      },
      {
        active: [] as ICreditCardPolicyGroup[],
        inactive: [] as ICreditCardPolicyGroup[],
      }
    );
  };
}

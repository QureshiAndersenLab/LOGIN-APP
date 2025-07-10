import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { IPoliciesGroupState } from '@shared/models';
import { PoliciesService } from '@services';
import { shareReplay, startWith, catchError, tap } from 'rxjs';
import { of } from 'rxjs';
import {
  CreditCardComponent,
  NoPoliciesNotificationComponent,
} from './components';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { TranslateModule } from '@ngx-translate/core';
import { groupPolicies } from '@shared/utils';

@Component({
  selector: 'app-policies-container',
  imports: [
    CommonModule,
    CreditCardComponent,
    NoPoliciesNotificationComponent,
    CdkAccordionModule,
    TranslateModule,
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
    groupPolicies(),
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
}

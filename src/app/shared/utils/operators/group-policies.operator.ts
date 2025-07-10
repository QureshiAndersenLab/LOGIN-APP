import { ICreditCardPolicyGroup, IPoliciesGroupState } from '@shared/models';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function groupPolicies(): OperatorFunction<
  ICreditCardPolicyGroup[],
  IPoliciesGroupState
> {
  return map((groups) => {
    return groups.reduce<IPoliciesGroupState>(
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
        active: [],
        inactive: [],
      }
    );
  });
}

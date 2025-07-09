import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ICreditCardPolicyGroup } from '@shared/models';
import { PolicyCardComponent } from '../policy-card';
import { MaskCardNumberPipe } from 'app/pipes/mask-card-number.pipe';

@Component({
  selector: 'app-credit-card',
  imports: [PolicyCardComponent, MaskCardNumberPipe],
  templateUrl: './credit-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardComponent {
  creditCard = input.required<ICreditCardPolicyGroup>();
}

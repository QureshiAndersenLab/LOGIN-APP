import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IPolicy } from '@shared/models';

@Component({
  selector: 'app-policy-card',
  imports: [CommonModule],
  templateUrl: './policy-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyCardComponent {
  policy = input.required<IPolicy>();
}

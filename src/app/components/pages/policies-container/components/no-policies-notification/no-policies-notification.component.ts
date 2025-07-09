import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-no-policies-notification',
  templateUrl: './no-policies-notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoPoliciesNotificationComponent {}

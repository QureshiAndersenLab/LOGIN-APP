import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-policies-notification',
  templateUrl: './no-policies-notification.component.html',
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoPoliciesNotificationComponent {}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TimerService } from '@services';
import { LOGIN_EXPIRY_TIME_KEY } from '@shared/constants';
import { TabComponent, TabsContainerComponent } from '@shared/ui';
import { PoliciesContainerComponent } from '@components';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    TabsContainerComponent,
    TranslateModule,
    TabComponent,
    PoliciesContainerComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  readonly #timerService = inject(TimerService);

  ngOnInit(): void {
    const expiryTime = localStorage.getItem(LOGIN_EXPIRY_TIME_KEY);

    if (expiryTime) {
      this.#timerService.startLogoutTimer();
    }
  }
}

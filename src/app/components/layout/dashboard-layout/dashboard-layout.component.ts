import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocationService, TimerService } from '@services';
import { LOGIN_EXPIRY_TIME_KEY } from '@shared/constants';
import { TabComponent, TabsContainerComponent } from '@shared/ui';
import { PoliciesContainerComponent } from '@components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    TabsContainerComponent,
    TranslateModule,
    TabComponent,
    PoliciesContainerComponent,
    CommonModule,
  ],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  readonly #timerService = inject(TimerService);
  readonly #locationService = inject(LocationService);
  readonly city = this.#locationService.getIpLocation();

  ngOnInit(): void {
    const expiryTime = localStorage.getItem(LOGIN_EXPIRY_TIME_KEY);

    if (expiryTime) {
      this.#timerService.startLogoutTimer();
    }
  }
}

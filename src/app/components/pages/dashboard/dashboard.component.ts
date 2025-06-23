import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FamilyformComponent } from './components';
import { LOGIN_EXPIRY_TIME_KEY } from '@shared/constants';
import { TimerService } from 'app/services/timer.service';

@Component({
  selector: 'allianz-dashboard',
  imports: [FamilyformComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  readonly #timerService = inject(TimerService);

  ngOnInit(): void {
    const expiryTime = localStorage.getItem(LOGIN_EXPIRY_TIME_KEY);

    if (expiryTime) {
      this.#timerService.startLogoutTimer();
    }
  }
}

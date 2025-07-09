import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutes } from 'app/app.routes';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'allianz-auth-layout',
  imports: [TranslateModule, CommonModule, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
  readonly #router = inject(Router);

  readonly #routeSignal = toSignal(
    this.#router.events.pipe(
      startWith(null),
      map(() => this.#router.url)
    ),
    { initialValue: this.#router.url }
  );

  readonly #backRoute = computed(() => {
    const currentUrl = this.#routeSignal();
    if (currentUrl.includes(AppRoutes.OTP)) return AppRoutes.Login;
    return AppRoutes.Login;
  });

  goBack(): void {
    this.#router.navigate([this.#backRoute()]);
  }
}

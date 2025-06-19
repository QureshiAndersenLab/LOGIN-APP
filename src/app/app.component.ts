import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent, NavbarComponent } from '@components';
import { AppRoutes } from './app.routes';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, startWith } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService, TimerService } from '@services';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    CommonModule,
    FooterComponent,
    NavbarComponent,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #timerService = inject(TimerService);
  readonly #loginService = inject(LoginService);
  readonly #destroyRef = inject(DestroyRef);

  readonly isLoggedIn$: Observable<boolean> = this.#loginService.isLoggedIn$;

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

  ngOnInit(): void {
    this.#timerService.sessionExpired$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#loginService.logout());
  }

  goBack(): void {
    this.#router.navigate([this.#backRoute()]);
  }
}

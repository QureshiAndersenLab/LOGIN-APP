import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { AppRoutes } from './app.routes';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

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
export class AppComponent {
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

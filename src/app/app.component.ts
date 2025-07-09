import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FooterComponent, NavbarComponent } from '@components';
import { LoginService, TimerService } from '@services';

@Component({
  selector: 'app-root',
  imports: [RouterModule, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #timerService = inject(TimerService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #loginService = inject(LoginService);

  ngOnInit(): void {
    this.#timerService.sessionExpired$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#loginService.logout());
  }
}

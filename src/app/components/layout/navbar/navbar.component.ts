import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LanguageSelectorComponent } from '@components';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '@services';
import { AppRoutes } from 'app/app.routes';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    LanguageSelectorComponent,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly #loginService = inject(LoginService);
  readonly #router = inject(Router);

  isLoggedIn$: Observable<boolean> = this.#loginService.isLoggedIn$;

  handleLogout(): void {
    this.#loginService.logout();
    this.#router.navigate([AppRoutes.Login]);
  }
}

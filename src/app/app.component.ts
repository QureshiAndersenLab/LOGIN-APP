import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { AppRoutes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #router = inject(Router);

  goBack(): void {
    const currentUrl = this.#router.url;
    if (currentUrl.includes(AppRoutes.OTP)) {
      this.#router.navigate(['/']);
    }
  }
}

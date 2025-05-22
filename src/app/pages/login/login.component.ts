import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent, FooterComponent } from '@layout';

@Component({
  selector: 'allianz-login',
  imports: [FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  email = '';

  readonly #location = inject(Location);

  goBack(): void {
    this.#location.back();
  }
}

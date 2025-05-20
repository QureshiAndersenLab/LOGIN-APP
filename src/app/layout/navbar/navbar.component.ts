import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {}

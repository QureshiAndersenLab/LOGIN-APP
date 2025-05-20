import { Component } from '@angular/core';
import { FooterLinks } from '../../shared/models/general.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  footerLinks: FooterLinks[] = [
    { name: 'Help Center', link: '' },
    { name: 'Legal information', link: '' },
    { name: 'Privacy statement', link: '' },
    { name: 'Cookie policy', link: '' },
  ];
}

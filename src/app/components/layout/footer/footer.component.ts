import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterLinks } from '@shared/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly footerLinks: FooterLinks[] = [
    { name: 'Help Center', link: '' },
    { name: 'Legal information', link: '' },
    { name: 'Privacy statement', link: '' },
    { name: 'Cookie policy', link: '' },
  ];
}

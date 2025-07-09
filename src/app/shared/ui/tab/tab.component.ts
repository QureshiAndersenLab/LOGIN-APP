import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-tab',
  imports: [],
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  tabTitle = input.required<string>();
  active = signal<boolean>(false);
}

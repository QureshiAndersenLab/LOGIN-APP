import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  imports: [CommonModule],
  templateUrl: './tabs-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter((tab) => tab.active());

    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent): void {
    this.tabs.forEach((t) => t.active.set(false));
    tab.active.set(true);
  }
}

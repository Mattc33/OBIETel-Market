import { Component, ViewChild } from '@angular/core';

import { TopNavComponent } from './top-nav/top-nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    @ViewChild(TopNavComponent) topNavChild: TopNavComponent;

    isSideBarMini = false;

    eventReceiveSidenavToggle($event) {
        this.isSideBarMini = !this.isSideBarMini;
        this.topNavChild.onToggleSideNav();
    }

}

import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {

    @Output() sidenavToggleEvent = new EventEmitter<boolean>();

    isExpanded = true;
    isSideBarMini = false;

    constructor() { }

    onToggleSideNav() {
        this.isExpanded = !this.isExpanded;
        this.isSideBarMini = !this.isSideBarMini;
        this.sidenavToggleEvent.emit(this.isSideBarMini);
    }

}

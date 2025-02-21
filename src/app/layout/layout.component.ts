import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    SidebarComponent,
    MatDrawer,
    MatDrawerContainer,
      MatDrawerContent,
  ],
  templateUrl: 'layout.component.html',
  standalone: true
})
export class LayoutComponent {

}

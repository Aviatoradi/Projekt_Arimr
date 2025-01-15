import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, MatSidenavModule],
  template: `
    <mat-drawer-container class="main-container">
      <mat-drawer mode="side" opened>
        <app-sidebar></app-sidebar>
      </mat-drawer>

      <mat-drawer-content>
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }

    .main-container {
      height: 100vh;
      width: 100vw;
      margin: 0;
    }

    mat-drawer {
      width: 250px;
      background-color: #34c759; /* Jasnozielony */
      color: white;
      border: none;
      box-shadow: none;
    }

    mat-drawer-content {
      padding: 0;
      margin: 0;
      height: 100vh;
      overflow-y: auto;
    }
  `]
})

export class AppComponent {}

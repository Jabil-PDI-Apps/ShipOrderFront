import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
    itemsPanelMenu: MenuItem[] | undefined;
    activeAside: boolean = false;

    ngOnInit() {
        this.itemsPanelMenu = [
            {
                label: 'Home',
                icon: 'pi pi-home',
                routerLink: '/home'
            },
            {
                label: 'Dashboard',
                icon: 'pi pi-chart-bar',
                routerLink: '/dashboard'
            }
        ];
    }

    toggleAside() {
        this.activeAside = !this.activeAside;
    }
}

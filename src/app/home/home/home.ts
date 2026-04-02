import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit(){
    this.items = [{ label: 'Home' }];
    this.home = { icon: 'pi pi-home', routerLink: '/home' };

  }
}

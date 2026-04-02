import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Home } from './home/home';
import { HomeRoutingModule } from './home-routing-module';

import { BreadcrumbModule } from 'primeng/breadcrumb';


@NgModule({
  declarations: [
    Home
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    BreadcrumbModule
  ]
})
export class HomeModule { }

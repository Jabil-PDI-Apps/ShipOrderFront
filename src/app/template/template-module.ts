import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateRoutingModule } from './template-routing-module';
import { Layout } from './layout/layout';
import { FormsModule } from '@angular/forms';

import { MenubarModule } from 'primeng/menubar';
import { PanelMenu } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { HomeModule } from '../home/home-module'
import { DashboardModule } from '../dashboard/dashboard-module'

@NgModule({
  declarations: [
    Layout
  ],
  imports: [
    CommonModule,
    FormsModule,
    TemplateRoutingModule,
    MenubarModule,
    PanelMenu,
    ButtonModule,
    DrawerModule,
    Drawer,
    HomeModule,
    DashboardModule
  ]
})
export class TemplateModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { AdmindashRoutingModule } from './admindash-routing.module';
import { AdmindashComponent } from './admindash.component';

import { SidenavComponent } from './sidenav/sidenav.component';
import { ListesprojetsComponent } from './listesprojets/listesprojets.component';
import { ListesemplyesComponent } from './listesemplyes/listesemplyes.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectFormComponent } from './project-form/project-form.component';


@NgModule({
  declarations: [
    AdmindashComponent,
    SidenavComponent,
    ListesprojetsComponent,
    ListesemplyesComponent,
    MainComponent,
    HeaderComponent,
    ProjectFormComponent,
   
    
   
  ],
  imports: [
    CommonModule,
    AdmindashRoutingModule,
    ReactiveFormsModule
   
   
  ]
})
export class AdmindashModule { }

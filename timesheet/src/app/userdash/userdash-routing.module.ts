import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserdashComponent } from './userdash.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{ path: '', component: UserdashComponent ,
  children:[
    
    { path: 'home', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
  ]
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserdashRoutingModule { }

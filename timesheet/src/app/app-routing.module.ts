import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './component/contact/contact.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { ConnexionComponent } from './component/connexion/connexion.component';
import { ProjetsComponent } from './component/projets/projets.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { InscriptionComponent } from './component/inscription/inscription.component';
import { ForgetpasswordComponent } from './component/forgetpassword/forgetpassword.component';
import { ClientProfileComponent } from './component/client-profile/client-profile.component';


const routes: Routes = [

  
  
  {
    path:'header',
    component: HeaderComponent
  },
  {
    path:'footer',
    component: FooterComponent
  },
  {
    path:'connexion',
    component: ConnexionComponent
  },
  {
    path:'contact',
    component: ContactComponent
  },
  {
    path:'accueil',
    component: AccueilComponent
  },
  {
    path:'projets',
    component: ProjetsComponent
  },
  {
    path:'inscription',
    component: InscriptionComponent
  },
  {
    path: 'forgetpassword',
    component: ForgetpasswordComponent
  },
  {
    path: 'client-profile',
    component: ClientProfileComponent
  },
  { path: '', component: AccueilComponent },

  
  
  { path: 'admindash', loadChildren: () => import('./admindash/admindash.module').then(m => m.AdmindashModule) },

  
  
  { path: 'userdash', loadChildren: () => import('./userdash/userdash.module').then(m => m.UserdashModule) },

  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }

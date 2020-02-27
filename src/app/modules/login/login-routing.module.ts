import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginRouteComponent } from './components/login-route/login-route.component';


const routes: Routes = [
  {
    path: '',
    component: LoginRouteComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

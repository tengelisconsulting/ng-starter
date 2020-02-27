import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRouteComponent } from './components/login-route/login-route.component';
import { LoginRoutingModule } from './login-routing.module';


@NgModule({
  declarations: [
    LoginRouteComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
  ]
})
export class LoginModule { }

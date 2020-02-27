import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRouteComponent } from './components/landing-route/landing-route.component';
import { LandingRoutingModule } from './landing-routing.module';



@NgModule({
  declarations: [
    LandingRouteComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
  ]
})
export class LandingModule { }

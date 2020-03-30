import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, never } from 'rxjs';

import { SessionService } from '../session.service';
import { filter, map } from 'rxjs/operators';
import { AppRoutePath } from './AppRoutePath';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.sessionService.getStartedStream(never()).pipe(
      filter((isStarted) => isStarted !== null),
      map((isStarted) => {
        if (!isStarted) {
          const intendedRoute: string = state.url;
          console.log(
            "no session - redirect to login and save intended route:",
            intendedRoute
          );
          this.sessionService.saveIntendedUrl(intendedRoute);
          this.router.navigate([AppRoutePath.LOGIN]);
        }
        return isStarted;
      }),
    );
  }

}

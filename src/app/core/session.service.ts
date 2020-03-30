import { Injectable } from '@angular/core';
import { merge } from "lodash";
import { never, Observable } from 'rxjs';

import { State } from './state/state';
import { takeUntil, filter, map, startWith } from 'rxjs/operators';

interface InternalState {
  isStarted: boolean;
  permissions: string[];
  sessionToken: string;
  urlBeforeSessionExpire: string;
}


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private get EMPTY_STATE(): InternalState {
    return {
      isStarted: false,
      permissions: [],
      sessionToken: null,
      urlBeforeSessionExpire: null,
    };
  }

  private internalState: State<InternalState> = new State(
    never(), merge(
      {}, this.EMPTY_STATE, { isStarted: null }
    )
  );

  constructor() { }

  public enterSession(
    sessionToken: string,
    permissions: string[]
  ): void {
    this.internalState.update({
      sessionToken: sessionToken,
      permissions: permissions,
      isStarted: true,
    });
  }

  public exitSession(): void {
    this.internalState.update(this.EMPTY_STATE);
  }

  public isAuthenticated(): boolean {
    return !!this.internalState.value.sessionToken;
  }

  public saveIntendedUrl(
    url: string
  ): void {
    this.internalState.update({
      urlBeforeSessionExpire: url,
    });
  }

  public getStartedStream(
    until$: Observable<any>
  ): Observable<boolean> {
    return this.internalState.changeStream().pipe(
      takeUntil(until$),
      filter((change) => change.isStarted !== undefined),
      map((change) => change.isStarted),
      startWith(this.internalState.value.isStarted)
    );
  }

  public getSessionToken(): string {
    return this.internalState.value.sessionToken;
  }
}

import { Injectable } from '@angular/core';
import { never, Observable, BehaviorSubject } from 'rxjs';
import * as _ from "lodash";
import { takeUntil } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Env } from "../types/Env";
import { State } from './state/state';


interface RuntimeState {
  mode: "prod" | "dev";
}

@Injectable({
  providedIn: 'root'
})
export class RunTimeEnvService {

  private getProdEnv(): Env {
    return {
      apiHost: "https://production-api-server",
    };
  }

  private getDevEnv(): Env {
    return {
      apiHost: "http://localhost",
    };
  }


  private runtimeState: State<RuntimeState> = new State(
    never(), {
      mode: environment.production ? "prod" : "dev",
    }
  );

  private env$: BehaviorSubject<Env> = new BehaviorSubject(
    this.deriveEnv()
  );

  private consoleRefs = {
    log: window['console'].log,
    debug: window['console'].debug,
  };

  constructor() {
    this.applyRuntimeState();
    this.runtimeState.changeStream()
      .subscribe(() => {
        this.applyRuntimeState();
        this.env$.next(this.deriveEnv());
      });
    window["_APP_setRuntimeMode"] = (
      mode: any
    ) => this.setRuntimeMode(mode);
  }

  public setRuntimeMode(mode: any): void {
    if (mode === "prod" || mode === "dev") {
      console.info("parsed mode: ", mode);
      this.runtimeState.update({ mode: mode });
    } else {
      console.error("can't apply runtime mode: ", mode);
      console.error("use mode 'prod' or 'dev'");
    }
  }

  public getEnv$(destroyed$: Observable<any>): Observable<Env> {
    return this.env$.pipe(
      takeUntil(destroyed$),
    );
  }

  private applyRuntimeState(): void {
    this.runtimeState.value.mode === "prod" ?
      this.applyProdMode() : this.applyDevMode();
  }

  private applyProdMode(): void {
    Object.keys(this.consoleRefs).forEach((key) => {
      window['console'][key] = () => {};
    });
  }

  private applyDevMode(): void {
    Object.keys(this.consoleRefs).forEach((key) => {
      window['console'][key] = this.consoleRefs[key];
    });
  }

  private deriveEnv(): Env {
    return this.runtimeState.value.mode === "prod" ?
      this.getProdEnv() : this.getDevEnv();
  }

}

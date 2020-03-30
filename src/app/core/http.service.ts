import { Injectable } from '@angular/core';
import { never } from 'rxjs';

import { shallowMerge } from '../lib/fn';
import { RunTimeEnvService } from './run-time-env.service';
import { SessionService } from './session.service';


interface AppHttpRequest {
  method: "GET" | "POST" | "PUT";
  path: string;
  data?: any;
  headers: {
    [index: string]: string
  };
  cache: RequestCache,
  mode?: RequestMode,
  credentials?: RequestCredentials,
}


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly baseReqDefaults: Partial<AppHttpRequest> = {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "default",
    credentials: "include",
  };

  private API_HOST: string;

  constructor(
    private runtimeEnvService: RunTimeEnvService,
    private sessionService: SessionService,
  ) {
    this.runtimeEnvService.getEnv$(never())
      .subscribe((env) => this.API_HOST = env.apiHost);
    window['postReq'] = this.postReq.bind(this);
  }

  public postReq(req: Partial<AppHttpRequest>): Promise<Response> {
    const reqHeaders = shallowMerge(
      req.headers || {}, this.getDefaultAuthedHeaders()
    );
    return this.doRequest(
      shallowMerge(
        this.baseReqDefaults,
        req,
        {
          method: "POST",
          headers: reqHeaders,
        },
      )
    );
  }

  public getReq(req: Partial<AppHttpRequest>): Promise<Response> {
    const reqHeaders = shallowMerge(
      req.headers || {}, this.getDefaultAuthedHeaders()
    );
    return this.doRequest(
      shallowMerge(
        this.baseReqDefaults,
        req,
        {
          method: "GET",
          headers: reqHeaders,
        },
      )
    );
  }

  public postNoAuth(req: Partial<AppHttpRequest>): Promise<Response> {
    return this.doRequest(
      shallowMerge(
        this.baseReqDefaults,
        req,
        { method: "POST" }
      )
    );
  }

  private getDefaultAuthedHeaders(): {[index: string]: string} {
    return {
      'Authorization': `Bearer: ${this.sessionService.getSessionToken()}`
    };
  }

  private doRequest(req: AppHttpRequest): Promise<Response> {
    const request = new Request(
      `${this.API_HOST}${req.path}`, shallowMerge<RequestInit>({
        method: req.method,
        headers: new Headers(req.headers),
      }, req.data ? {
          body: JSON.stringify(req.data),
        }: {})
    );
    const requestInit: RequestInit = {
      cache: req.cache,
      mode: req.mode,
      credentials: req.credentials,
    };
    return fetch(
      request, requestInit
    );
  }
}

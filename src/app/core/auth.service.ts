import { Injectable } from '@angular/core';

import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpService: HttpService,
  ) { }

  public async authenticate(
    username: string,
    password: string
  ): Promise<string> {
    const authRes = await this.httpService.postNoAuth({
      path: "/auth/authenticate/username-password",
      data: {
        username: username,
        password: password,
      },
    });
    if (!authRes.ok) {
      return null;
    }
    const token = await authRes.json();
    console.log("authentication success, session token: ", token);
    return token;
  }

  public async attemptRenewSession(): Promise<string> {
    const res = await this.httpService.postNoAuth({
      path: "/auth/renew-session",
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const token = data.session_token;
    console.log("session renew success, received token: ", token);
    return token;
  }

}

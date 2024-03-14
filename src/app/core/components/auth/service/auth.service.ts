import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, first, map, of } from 'rxjs';
import { AuthRegisterRequest } from '../interfaces/AuthRegisterRequest';
import { AuthConfirmRegisterRequest } from '../interfaces/AuthConfirmRegisterRequest';
import { AuthForgotPasswordRequest } from '../interfaces/AuthForgotPasswordRequest';
import { AuthForgotPasswordTokenResponse } from '../interfaces/AuthForgotPasswordTokenResponse';
import { AuthResetPasswordRequest } from '../interfaces/AuthResetPasswordRequest';
import { AuthLoginRequest } from '../interfaces/AuthLoginRequest';
import { AuthLoginResponse } from '../interfaces/AuthLoginResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly APICREATE = '/api/user';
  private readonly APIAUTH = '/api/auth';
  private readonly APITEST = '/api/test';
  constructor(private httpClient: HttpClient, private router: Router) { }

  register(record: AuthRegisterRequest) {
    return this.httpClient
      .post<AuthRegisterRequest>(this.APICREATE, record)
      .pipe(first());
  }
  confirmRegister(record: AuthConfirmRegisterRequest) {
    return this.httpClient
      .post<AuthConfirmRegisterRequest>(
        `${this.APICREATE}/confirm-register`,
        record
      )
      .pipe(first());
  }
  sendEmailForgotPassword(record: AuthForgotPasswordRequest) {
    return this.httpClient
      .post<AuthForgotPasswordRequest>(
        `${this.APICREATE}/forgot-password`,
        record
      )
      .pipe(first());
  }

  resetPassword(record: AuthResetPasswordRequest, token: string | null) {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Token-Password', `${token}`);
    }
    return this.httpClient
      .post<AuthResetPasswordRequest>(
        `${this.APICREATE}/forgot-password/reset-password`,
        record,
        { headers }
      )
      .pipe(first());
  }

  confirmCodeForgot(code: number | null, email: string | null) {
    return this.httpClient
      .get<AuthForgotPasswordTokenResponse>(
        `${this.APICREATE}/forgot-password/${code}/${email}`
      )
      .pipe(first());
  }

  login(record: AuthLoginRequest) {
    return this.httpClient
      .post<AuthLoginResponse>(
        `${this.APIAUTH}`,
        record
      )
      .pipe(first());
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const jwtHelper = new JwtHelperService();

    if (!jwtHelper.isTokenExpired(token)) {
      return of(true);
    } else {
      return this.handleTokenRefresh(refresh_token);
    }
  }

  logout(){
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.router.navigate(['']);
  }

  handleTokenRefresh(refresh_token: string | null): Observable<boolean> {
    const record = { token: refresh_token };

    return this.httpClient
      .post<{ token: string }>(`${this.APIAUTH}/refresh-token`, record)
      .pipe(
        map(result => {
          localStorage.setItem("access_token", result.token);
          return true;
        }),
        catchError(err => {
          if (err.status === 401) {
            this.logout();
          }
          return of(false);
        })
      );
  }

  test(): Observable<any> {
    let headers = new HttpHeaders();

    headers = headers.set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

    return this.httpClient
      .get<AuthResetPasswordRequest>(
        `${this.APITEST}`,
        { headers }
      )
      .pipe(first());
  }
}


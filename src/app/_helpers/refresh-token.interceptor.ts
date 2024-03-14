import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../core/components/auth/service/auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  refreshing = false;
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });
    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('admin') &&
          error.status === 401
        ) {
          return this.handleUnauthorizedError(req, next);
        }

        return throwError(() => error);
      })
    );
  }
  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshing) {
      this.refreshing = true;
      const refreshToken = localStorage.getItem("refresh_token");
        return this.authService.handleTokenRefresh(refreshToken).pipe(
          switchMap((value) => {
            if(!value){
              return EMPTY;
            }
            this.refreshing = false;
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
              }
            });
            return next.handle(request)
          }),
          catchError((error) => {
            this.refreshing = false;
            return throwError(() => error);
          })
        );
    }
    return next.handle(request);
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './core/components/pages/not-found/not-found.component';
import { RefreshTokenInterceptor } from './_helpers/refresh-token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

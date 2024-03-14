import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignComponent } from './pages/sign/sign.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    SignComponent,
    RegisterComponent,
    RecoveryPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSnackBarModule,
  ]
})
export class AuthModule { }

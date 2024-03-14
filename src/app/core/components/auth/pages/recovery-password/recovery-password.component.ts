import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthForgotPasswordRequest } from '../../interfaces/AuthForgotPasswordRequest';
import { AuthService } from '../../service/auth.service';
import { MatStepper } from '@angular/material/stepper';
import { AuthForgotPasswordTokenResponse } from '../../interfaces/AuthForgotPasswordTokenResponse';
import { Location } from '@angular/common';
import { AuthResetPasswordRequest } from '../../interfaces/AuthResetPasswordRequest';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss','../../auth.component.scss']
})
export class RecoveryPasswordComponent {

  @ViewChild('stepper') private stepper: MatStepper;

  disableButtons: boolean = false;

  sendCodeFormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  confirmCodeFormGroup = new FormGroup({
    code: new FormControl(null, [Validators.required, Validators.maxLength(6)]),
  });

  resetPasswordFormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    passwordConfirmation: new FormControl(null, [Validators.required]),
  });

  sendCodeText: string = '30';
  remainingSeconds: number = 30;
  timerInProgress: boolean = false;
  timerInterval: any;

  token_reset : string | null = null;
  constructor(private service: AuthService, private location: Location, private snackBar: MatSnackBar){}

  startTimer(time: number) {
    this.remainingSeconds = time;
    this.timerInProgress = true;
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.sendCodeText = this.remainingSeconds.toString();
      } else {
        this.timerInProgress = false;
        this.sendCodeText = 'Send code again';
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  create(jumtonext: boolean = true){
    if (!this.sendCodeFormGroup.valid) {
      this.sendCodeFormGroup.markAllAsTouched();
      return;
    }

    this.disableButtons = true;

    const model: AuthForgotPasswordRequest = {
      email: this.sendCodeFormGroup.value.email || null,
    };

    this.service.sendEmailForgotPassword(model).subscribe({
      next: (result) => this.onCreateSucess(result, jumtonext),
      error: (err) => this.onError(err),
    });
  }
  onError(err: any) {
    this.disableButtons = false;
    this.snackBar.open("❌ Error: " + err.error.messages[0],"",{duration: 3000, panelClass:['custom-snackbar']});
  }
  onCreateSucess(result: any, jumptonext: boolean) {
    this.disableButtons = false;
    this.startTimer(30);
    if(jumptonext)
      this.stepper.next();
  }
  confirm() {
    if (!this.confirmCodeFormGroup.valid) {
      this.confirmCodeFormGroup.markAllAsTouched();
      return;
    }

    this.disableButtons = true;
    const code = this.confirmCodeFormGroup.value.code? this.confirmCodeFormGroup.value.code : null;
    const email = this.sendCodeFormGroup.value.email? this.sendCodeFormGroup.value.email : null;
    this.service.confirmCodeForgot(code, email).subscribe({
      next: (result) => this.onConfirmSucess(result),
      error: (err) => this.onError(err),
    });
  }
  onConfirmSucess(result: AuthForgotPasswordTokenResponse): void {
    this.disableButtons = false;
    this.token_reset = result.token;
    this.stepper.next();
  }
  redefinePassword() {
    if (
      this.resetPasswordFormGroup.value.password !=
      this.resetPasswordFormGroup.value.passwordConfirmation
    ) {
      this.resetPasswordFormGroup.get('passwordConfirmation')?.setErrors({ passwordMismatch: true });
    }

    if (!this.resetPasswordFormGroup.valid) {
      this.resetPasswordFormGroup.markAllAsTouched();
      return;
    }
    this.disableButtons = true;
    const model : AuthResetPasswordRequest = {
      email: this.sendCodeFormGroup.value.email? this.sendCodeFormGroup.value.email : null,
      password: this.resetPasswordFormGroup.value.password? this.resetPasswordFormGroup.value.password : null
    }
    this.service.resetPassword(model, this.token_reset).subscribe({
      next: (result) => this.onRedefineSucess(result),
      error: (err) => this.onError(err),
    });
  }
  onRedefineSucess(result: AuthResetPasswordRequest): void {
    this.disableButtons = false;
    this.snackBar.open("✔️ Password changed!","",{duration: 3000, panelClass:['custom-snackbar']});
    this.location.back();
  }

}

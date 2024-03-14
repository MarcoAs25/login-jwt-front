import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from '../../service/auth.service';
import { AuthRegisterRequest } from '../../interfaces/AuthRegisterRequest';
import { AuthConfirmRegisterRequest } from '../../interfaces/AuthConfirmRegisterRequest';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../auth.component.scss'],
})
export class RegisterComponent {
  @ViewChild('stepper') private stepper: MatStepper;
  disableButtons: boolean = false;
  sendEmailFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirmation: new FormControl(null, [Validators.required]),
  });

  confirmEmailFormGroup = new FormGroup({
    code: new FormControl(null, [Validators.required, Validators.maxLength(6)]),
  });
  sendCodeText: string = '30';
  remainingSeconds: number = 30;
  timerInProgress: boolean = false;
  timerInterval: any;
  constructor(private service: AuthService, private location: Location, private snackBar: MatSnackBar) {}

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

  create(jumptonext: boolean = true) {
    if (
      this.sendEmailFormGroup.value.password !=
      this.sendEmailFormGroup.value.passwordConfirmation
    ) {
      this.sendEmailFormGroup
        .get('passwordConfirmation')
        ?.setErrors({ passwordMismatch: true });
    }

    if (!this.sendEmailFormGroup.valid) {
      this.sendEmailFormGroup.markAllAsTouched();
      return;
    }
    this.disableButtons = true;

    const model: AuthRegisterRequest = {
      email: this.sendEmailFormGroup.value.email || null,
      name: this.sendEmailFormGroup.value.name || null,
      password: this.sendEmailFormGroup.value.password || null,
    };

    this.service.register(model).subscribe({
      next: (result) => this.onCreateSucess(result, jumptonext),
      error: (err) => this.onError(err),
    });
  }

  onCreateSucess(result: AuthRegisterRequest, jumptonext: boolean): void {
    this.disableButtons = false;
    if (jumptonext) {
      this.stepper.next();
    }
    this.startTimer(30);
  }

  onError(err: any) {
    this.disableButtons = false;
    this.snackBar.open("❌ Error: " + err.error.messages[0],"",{duration: 3000, panelClass:['custom-snackbar']});
  }

  confirm() {
    if (!this.confirmEmailFormGroup.valid) {
      this.confirmEmailFormGroup.markAllAsTouched();
      return;
    }
    this.disableButtons = true;
    const model: AuthConfirmRegisterRequest = {
      email: this.sendEmailFormGroup.value.email || null,
      code: this.confirmEmailFormGroup.value.code || null,
    };
    this.service.confirmRegister(model).subscribe({
      next: (result) => this.onConfirmSucess(result),
      error: (err) => this.onError(err),
    });
  }

  onConfirmSucess(result: AuthConfirmRegisterRequest): void {
    this.disableButtons = false;
    this.snackBar.open("✔️ registration completed!","",{duration: 3000, panelClass:['custom-snackbar']});
    this.location.back();
  }
}

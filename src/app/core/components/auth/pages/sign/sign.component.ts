import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AuthLoginRequest } from '../../interfaces/AuthLoginRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthLoginResponse } from '../../interfaces/AuthLoginResponse';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss', '../../auth.component.scss'],
})
export class SignComponent {

  disableButtons: boolean = false;

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(private router: Router, private route: ActivatedRoute, private service: AuthService, private snackBar: MatSnackBar) {
    this.service.isAuthenticated().subscribe(authenticated => {
      if (authenticated) {
        this.router.navigate(['admin']);
      }
    });
  }
  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.disableButtons = true;

    const model : AuthLoginRequest = {
      email: this.loginForm.value.email? this.loginForm.value.email : null,
      password: this.loginForm.value.password? this.loginForm.value.password : null,
    }
    this.service.login(model).subscribe({
      next: (result) => this.onLogin(result),
      error: (err) => this.onError(err),
    });
  }
  onLogin(result: AuthLoginResponse): void {
    this.disableButtons = false;
    localStorage.removeItem("acces_token");
    localStorage.removeItem("refresh_token");

    localStorage.setItem("access_token", result.token || "");
    localStorage.setItem("refresh_token", result.refresh || "");

    this.router.navigate(['admin']);
  }
  onError(err: any): void {
    this.disableButtons = false;
    this.snackBar.open("❌ Error: " + err.error.messages[0],"",{duration: 3000, panelClass:['custom-snackbar']});
  }
  register() {
    this.router.navigate(['register']);
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignComponent } from './pages/sign/sign.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';

const routes: Routes = [
  {
    path: '',
    component: SignComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'recovery-password',
    component: RecoveryPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

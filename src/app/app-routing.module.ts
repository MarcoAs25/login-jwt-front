import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { NotFoundComponent } from './core/components/pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/components/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', component: NotFoundComponent } // Rota curinga para lidar com rotas inexistentes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

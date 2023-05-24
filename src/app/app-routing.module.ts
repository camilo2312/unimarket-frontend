import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'auth',
    loadChildren: () => import('src/app/modules/auth/auth.module').then(m => m.AuthModule)
  },
  { 
    path: 'pages',
    loadChildren: () => import('src/app/modules/pages/pages.module').then(m => m.PagesModule)
  },
  { path: '', redirectTo: 'pages/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages/not-found' }
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  { path: "registro", component: RegistroComponent, canActivate: [LoginGuard] }
  { path: "crear-producto", component: CrearProductoComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["CLIENTE"] } },
  { path: "editar-producto/:codigo", component: CrearProductoComponent, canActivate:
    [RolesGuard], data: { expectedRole: ["CLIENTE"] } },
  { path: "gestionar-productos", component: GestionProductosComponent, canActivate:
    [RolesGuard], data: { expectedRole: ["CLIENTE"] } },
  { path: "revisar-productos", component: RevisarProductosComponent, canActivate: [RolesGuard],
    data: { expectedRole: ["MODERADOR"] } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

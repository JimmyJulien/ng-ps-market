import { Routes } from '@angular/router';

export const ROUTES = Object.freeze({
  STOCK: 'stock',
  VENTES: 'ventes',
  DONS: 'dons',
  REFERENTIELS: 'referentiels',
});

export const routes: Routes = [
  {
    path: ROUTES.STOCK,
    loadComponent: () => import('./features/stock/stock.component').then(c => c.StockComponent),
  },
  {
    path: ROUTES.VENTES,
    loadComponent: () => import('./features/ventes/ventes.component').then(c => c.VentesComponent),
  },
  {
    path: ROUTES.DONS,
    loadComponent: () => import('./features/dons/dons.component').then(c => c.DonsComponent),
  },
  {
    path: ROUTES.REFERENTIELS,
    loadComponent: () => import('./features/referentiels/referentiels.component').then(c => c.ReferentielsComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTES.STOCK,
  },
  {
    path: '**',
    redirectTo: ROUTES.STOCK,
  }
];

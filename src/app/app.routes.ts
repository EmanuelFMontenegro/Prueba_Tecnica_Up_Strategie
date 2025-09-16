import { Routes } from '@angular/router';
import { ShellComponent } from './shared/ui/shell/shell.component';

import { DetailPage } from '@features/detail/detail.page/detail.page';
import { ListPage } from './features/list/list.page/list.page';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: ListPage },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('@features/detail/detail.page/detail.page').then((m) => m.DetailPage),
        title: 'Detalle de cocktail',
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

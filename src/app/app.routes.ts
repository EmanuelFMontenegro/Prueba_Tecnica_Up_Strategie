import { Routes } from '@angular/router';
import { ShellComponent } from '@shared/ui/shell/shell.component';


import { ListPage } from '@features/list/list.page/list.page';
import { DetailPage } from '@features/detail/detail.page/detail.page';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: ListPage },
      { path: 'detail', component: DetailPage },
      { path: '**', redirectTo: '' },
    ]
  }
];

import { Routes } from '@angular/router';
import { PersonsListComponent } from './components/persons-list/persons-list.component';

export const routes: Routes = [
  { path: '', component: PersonsListComponent, pathMatch: 'full' },
];

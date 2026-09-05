import { Routes } from '@angular/router';
import { PersonsListComponent } from './components/persons-list/persons-list.component';
import { PersonFormComponent } from './components/person-form/person-form.component';

export const routes: Routes = [
  // Route principale : affiche la liste des personnes
  {
    path: '',
    component: PersonsListComponent,
    pathMatch: 'full',
  },

  // Route de création : affiche le formulaire vierge
  {
    path: 'add',
    component: PersonFormComponent,
  },

  // Route d'édition : réutilise le formulaire pré-rempli grâce à l'ID
  {
    path: 'edit/:id',
    component: PersonFormComponent,
  },

  // Redirection automatique en cas d'URL inconnue
  {
    path: '**',
    redirectTo: '',
  },
];

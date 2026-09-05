import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonServiceService } from '../../services/person-service.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-persons-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './persons-list.component.html',
  styleUrl: './persons-list.component.css',
})
export class PersonsListComponent implements OnInit {
  // Injection du service
  personService = inject(PersonServiceService);

  // Colonnes de la table Material
  displayedColumns: string[] = ['name', 'city', 'phoneNumber', 'actions'];

  ngOnInit(): void {
    // Charger les personnes au démarrage du composant
    this.personService.loadPersons();
  }

  // Méthode de suppression
  deletePerson(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette personne ?')) {
      this.personService.deletePerson(id).subscribe({
        error: (err) => console.error('Erreur lors de la suppression :', err),
      });
    }
  }
}

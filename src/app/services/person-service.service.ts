import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Person } from '../../model/Persons';

@Injectable({
  providedIn: 'root',
})
export class PersonServiceService {
  // Injection de HttpClient
  private personHttp = inject(HttpClient);
  constructor() {}

  private apiUrl = 'http://localhost:8080/api/persons/';

  // 1. Signal PRIVE contenant la liste mutable des personnes
  private PersonList = signal<Person[]>([]);

  // 2. Signal PUBLIC en LECTURE SEULE pour les composants
  private readonly = this.PersonList.asReadonly();

  loadPersons(): void {
    this.personHttp.get<Person[]>(`${this.apiUrl}/getAll`).subscribe({
      next: (data) => {
        this.PersonList.set(data);
      },
      error: (err) => console.error('Erreur de chargement :', err),
    });
  }
  
}

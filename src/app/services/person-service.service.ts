import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Person } from '../../model/Persons';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonServiceService {
  // Injection de HttpClient
  private personHttp = inject(HttpClient);
  constructor() {}

  private apiUrl = 'http://localhost:8080/api/persons/';

  // 1. Signal PRIVE contenant la liste mutable des personnes
  private personList = signal<Person[]>([]);

  // 2. Signal PUBLIC en LECTURE SEULE pour les composants
  private readonly = this.personList.asReadonly();

  /**
   * Récupère la liste depuis Spring Boot et remplace le contenu du Signal
   */
  loadPersons(): void {
    this.personHttp.get<Person[]>(`${this.apiUrl}/getAll`).subscribe({
      next: (data) => {
        this.personList.set(data);
      },
      error: (err) => console.error('Erreur de chargement :', err),
    });
  }

  /**
   * Récupère une personne par son ID
   */
  getPersonById(id: number) {
    return this.personHttp.get<Person>(`${this.apiUrl}/${id}`);
  }

  /**
   * Envoie une nouvelle personne au backend et met à jour le Signal localement
   */
  addPerson(person: Person) {
    this.personHttp.post<Person>(`${this.apiUrl}/create`, person).pipe(
      tap((newPerson) => {
        this.personList.update((currentPersons) => [
          ...currentPersons,
          newPerson,
        ]);
      }),
    );
  }

  /**
   * Met à jour une personne existante
   */
  updatePerson(id: number, person: Person) {
    this.personHttp.put<Person>(`${this.apiUrl}/update/${id}`, person).pipe(
      tap((updatedPerson) => {
        this.personList.update((currentPersons) =>
          currentPersons.map((p) => (p.id === id ? updatedPerson : p)),
        );
      }),
    );
  }

  /**
   * Supprime une personne côté backend et la retire du Signal local
   */
  deletePerson(id: number) {
    this.personHttp.delete<Person>(`${this.apiUrl}/delete/${id}`).pipe(
      tap(() => {
        this.personList.update((currentPersons) =>
          currentPersons.filter((p) => p.id !== id),
        );
      }),
    );
  }
}

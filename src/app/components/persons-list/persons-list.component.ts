import { Component, signal } from '@angular/core';
import { Person } from '../../../model/Persons';

@Component({
  selector: 'app-persons-list',
  imports: [],
  templateUrl: './persons-list.component.html',
  styleUrl: './persons-list.component.css',
})
export class PersonsListComponent {
  persons = signal<Person[]>([]);
}

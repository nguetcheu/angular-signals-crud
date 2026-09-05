import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PersonServiceService } from '../../services/person-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css',
})
export class PersonFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private personService = inject(PersonServiceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals pour gérer le mode édition
  isEditMode = signal<boolean>(false);
  personId = signal<number | null>(null);

  // Définition du formulaire réactif
  personForm = this.fb.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });

  ngOnInit(): void {
    // Vérifier si un ID est présent dans l'URL pour le mode modification
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);
      this.personId.set(id);
      this.isEditMode.set(true);

      // Charger les données de la personne à modifier
      this.personService.getPersonById(id).subscribe({
        next: (person) => {
          if (person) {
            this.personForm.patchValue({
              name: person.name,
              city: person.city,
              phoneNumber: person.phoneNumber,
            });
          }
        },
        error: (err) => console.error(`Erreur de chargement de la personne`, err),
      });
    }
  }

  onSubmit(): void {
    if (this.personForm.invalid) return;

    const formValue = this.personForm.value;
    const personData = {
      name: formValue.name!,
      city: formValue.city!,
      phoneNumber: formValue.phoneNumber!,
    };

    if (this.isEditMode() && this.personId()) {
      // Action Modification
      this.personService.updatePerson(this.personId()!, personData).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error(`Erreur lors de la modification`, err),
      });
    } else {
      // Action Création
      this.personService.addPerson(personData).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error(`Erreur lors de l'ajout`, err),
      });
    }
  }
}

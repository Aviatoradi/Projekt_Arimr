import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  ResourceRef,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Department } from './department';
import { DepartmentsRepository } from './departments.repository';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departments',
  imports: [MatIcon],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsComponent {
  private readonly repository = inject(DepartmentsRepository);

  private readonly router = inject(Router);

  readonly departments: ResourceRef<Department[] | undefined> = resource({
    loader: () => {
      return this.repository.getCurrentUserDepartments();
    },
  });

  readonly deps = computed(() => this.departments.value());

  viewDetails(department: Department) {
    this.router.navigate(['app', 'departments', department.id]);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
  numberAttribute,
  resource,
} from '@angular/core';
import { DepartmentsRepository } from '../components/departments/departments.repository';
import { GoalsListComponent } from "../users/goals-list/goals-list.component";

@Component({
  selector: 'app-department-page',
  imports: [GoalsListComponent],
  templateUrl: './department-page.component.html',
  styleUrl: './department-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentPageComponent {
  id = input.required({ transform: numberAttribute });

  private readonly departmentsRepository = inject(DepartmentsRepository);

  readonly departmentDetails = resource({
    request: () => ({
      id: this.id(),
    }),
    loader: ({ request }) => {
      console.log(this.id());
      return this.departmentsRepository.getOneDepartment(request.id);
    },
  });

  ngOnInit(): void {
    console.log(this.id);
  }
}

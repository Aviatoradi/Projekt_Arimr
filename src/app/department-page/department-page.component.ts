import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
  numberAttribute,
  resource,
} from '@angular/core';
import { DepartmentsRepository } from '../departments/departments.repository';

@Component({
  selector: 'app-department-page',
  imports: [],
  templateUrl: './department-page.component.html',
  styleUrl: './department-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentPageComponent {
  id = input.required({ transform: numberAttribute });

  private readonly departmentsRepository = inject(DepartmentsRepository);

  private readonly departmentDetails = resource({
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

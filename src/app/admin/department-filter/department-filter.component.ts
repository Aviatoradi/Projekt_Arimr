import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DepartmentDto } from '../dtos';

@Component({
  selector: 'app-department-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './department-filter.component.html',
})
export class DepartmentFilterComponent {
  @Input() departments: DepartmentDto[] = [];
  @Input() selectedDepartmentId: number | null = null;
  @Input() label: string = 'Filter by Department';
  @Input() allLabel: string = 'All Departments';

  @Output() departmentChanged = new EventEmitter<number | null>();

  onSelectionChange(departmentId: number | null): void {
    this.departmentChanged.emit(departmentId);
  }
}

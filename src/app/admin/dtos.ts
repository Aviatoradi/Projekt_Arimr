// src/goals/dto/create-goal.dto.ts
export interface CreateGoalDto {
  name: string;
  measure: string;
  type: string;
  isTemplate: boolean;
  departmentId?: number;
  parentGoalId?: number;
}
export interface UserDto {
  id: number;
  email: string;
  role: string;
  departments?: DepartmentAccessDto[];
}

// src/departments/dto/department.dto.ts
export interface DepartmentDto {
  id: number;
  name: string;
  fullName?: string;
  users?: DepartmentAccessDto[];
  goals?: GoalDto[];
}

// src/departments/dto/department-access.dto.ts
export interface DepartmentAccessDto {
  id: number;
  userId: number;
  departmentId: number;
  user?: UserDto;
  department?: DepartmentDto;
}

// src/goals/dto/goal.dto.ts
export interface GoalDto {
  id: number;
  name: string;
  measure: string;
  type: string;
  isTemplate: boolean;
  departmentId?: number;
  parentGoalId?: number;
  department?: DepartmentDto;
  parentGoal?: GoalDto;
  childrenGoal?: GoalDto[];
  tasks?: TaskDto[];
  programs?: ProgramDto[];
  createdAt: Date;
  updatedAt: Date;
}

// src/programs/dto/program.dto.ts
export interface ProgramDto {
  id: number;
  name: string;
  goalId: number;
  goal?: GoalDto;
  interventions?: InterventionDto[];
}

// src/interventions/dto/intervention.dto.ts
export interface InterventionDto {
  id: number;
  name: string;
  programId: number;
  program?: ProgramDto;
  intakes?: IntakeDto[];
  createdAt: Date;
  updatedAt: Date;
}

// src/intakes/dto/intake.dto.ts
export interface IntakeDto {
  id: number;
  name: string;
  endDate: Date;
  interventionId: number;
  intervention?: InterventionDto;
  applications?: IntakeApplicationDto[];
  createdAt: Date;
  updatedAt: Date;
}

// src/applications/dto/intake-application.dto.ts
export interface IntakeApplicationDto {
  id: number;
  applicationPrediction: number;
  applicationCount: number;
  editingUserId: number;
  intakeId: number;
  intake?: IntakeDto;
  createdAt: Date;
  updatedAt: Date;
}

// src/tasks/dto/task.dto.ts
export interface TaskDto {
  id: number;
  name: string;
  goalId: number;
  goal?: GoalDto;
  createdAt: Date;
  updatedAt: Date;
}

// src/goals/dto/update-goal.dto.ts
export interface UpdateGoalDto {
  name?: string;
  measure?: string;
  type?: string;
  isTemplate?: boolean;
  departmentId?: number;
}

// src/tasks/dto/create-task.dto.ts
export interface CreateTaskDto {
  name: string;
  goalId: number;
}

// src/tasks/dto/update-task.dto.ts
export interface UpdateTaskDto {
  name?: string;
  goalId?: number;
}

// src/programs/dto/create-program.dto.ts
export interface CreateProgramDto {
  name: string;
  goalId: number;
}

// src/programs/dto/update-program.dto.ts
export interface UpdateProgramDto {
  name?: string;
  goalId?: number;
}

// src/interventions/dto/create-intervention.dto.ts
export interface CreateInterventionDto {
  name: string;
  programId: number;
}

// src/interventions/dto/update-intervention.dto.ts
export interface UpdateInterventionDto {
  name?: string;
  programId?: number;
}

// src/intakes/dto/create-intake.dto.ts
export interface CreateIntakeDto {
  name: string;
  endDate: Date;
  interventionId: number;
}

// src/intakes/dto/update-intake.dto.ts
export interface UpdateIntakeDto {
  name?: string;
  endDate?: Date;
  interventionId?: number;
}

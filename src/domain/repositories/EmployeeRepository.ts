import { Employee } from "../entities/Employee";
import { BloodType } from "../entities/Types";

export interface EmployeeRepository {
  findByFilter(options?: {
    firstName?: string;
    lastName?: string;
    nationalId?: string;
    phone?: string;
    bloodType?: BloodType;
    email?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    data: Employee[];
    total: number;
    page: number;
    per_page: number;
  }>;
  findById(id: number): Promise<Employee | null>;
  create(data: Omit<Employee, "id">): Promise<Employee>;
  update(
    id: number,
    data: Partial<Omit<Employee, "id">>,
  ): Promise<Employee | null>;
  delete(id: number): Promise<void>;
}

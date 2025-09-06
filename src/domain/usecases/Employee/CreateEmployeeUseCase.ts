import { EmployeeRepository } from "../../repositories/EmployeeRepository";
import { Employee } from "../../entities/Employee";

export class CreateEmployeeUseCase {
  constructor(private repo: EmployeeRepository) {}
  async execute(data: Omit<Employee, "id">): Promise<Employee> {
    return await this.repo.create(data);
  }
}

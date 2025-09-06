import { EmployeeRepository } from "../../repositories/EmployeeRepository";
import { Employee } from "../../entities/Employee";

export class UpdateEmployeeUseCase {
  constructor(private repo: EmployeeRepository) {}
  async execute(
    id: number,
    data: Partial<Omit<Employee, "id">>,
  ): Promise<Employee | null> {
    return await this.repo.update(id, data);
  }
}

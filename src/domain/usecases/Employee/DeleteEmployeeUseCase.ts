import { EmployeeRepository } from "../../repositories/EmployeeRepository";

export class DeleteEmployeeUseCase {
  constructor(private repo: EmployeeRepository) {}
  async execute(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

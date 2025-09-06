import { EmployeeRepository } from "../../repositories/EmployeeRepository";

export class GetEmployeeByIdUseCase {
  constructor(private repo: EmployeeRepository) {}
  async execute(id: number) {
    return await this.repo.findById(id);
  }
}

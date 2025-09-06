import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";

export class GetAllUsersUseCase {
  constructor(private repo: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.repo.findAll();
  }
}

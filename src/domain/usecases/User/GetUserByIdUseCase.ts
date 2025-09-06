import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";

export class GetUserByIdUseCase {
  constructor(private repo: UserRepository) {}

  async execute(id: number): Promise<User | null> {
    return this.repo.findById(id);
  }
}

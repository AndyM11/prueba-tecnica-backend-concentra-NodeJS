import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";

export class GetUserByUsernameUseCase {
  constructor(private repo: UserRepository) {}

  async execute(username: string): Promise<User | null> {
    return this.repo.findByUsername(username);
  }
}

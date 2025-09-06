import { UserRepository } from "../../repositories/UserRepository";

export class DeleteUserUseCase {
  constructor(private repo: UserRepository) {}

  async execute(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

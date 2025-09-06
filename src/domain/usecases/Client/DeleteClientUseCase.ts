import { ClientRepository } from "../../repositories/ClientRepository";

export class DeleteClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
}

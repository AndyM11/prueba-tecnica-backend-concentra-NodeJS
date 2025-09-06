import { ClientRepository } from "../../repositories/ClientRepository";
import { Client } from "../../entities/Client";

export class GetClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(id: number): Promise<Client | null> {
    return await this.clientRepository.findById(id);
  }
}

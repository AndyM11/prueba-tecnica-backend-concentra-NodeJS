import { ClientRepository } from "../../repositories/ClientRepository";
import { Client } from "../../entities/Client";

export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(data: Omit<Client, "id">): Promise<Client> {
    // data ya tiene los campos en inglés: name, phone, clientType
    return await this.clientRepository.create(data);
  }
}

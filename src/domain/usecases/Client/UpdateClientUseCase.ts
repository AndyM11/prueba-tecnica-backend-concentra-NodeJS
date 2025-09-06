import { ClientRepository } from "../../repositories/ClientRepository";
import { Client, ClientType } from "../../entities/Client";

export class UpdateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(
    id: number,
    data: Partial<Omit<Client, "id">>,
  ): Promise<Client | null> {
    // data ya tiene los campos en inglés: name, phone, clientType
    if (
      data.clientType &&
      !Object.values(ClientType).includes(data.clientType)
    ) {
      throw new Error("Invalid clientType");
    }
    return await this.clientRepository.update(id, data);
  }
}

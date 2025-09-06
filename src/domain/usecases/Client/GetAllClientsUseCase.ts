import { ClientRepository } from "../../repositories/ClientRepository";
import { Client } from "../../entities/Client";

export class GetAllClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(
    params: {
      page?: number;
      per_page?: number;
      nombre?: string;
      telefono?: string;
      tipoCliente?: string;
    } = {},
  ): Promise<{
    data: Client[];
    total: number;
    page: number;
    per_page: number;
  }> {
    return await this.clientRepository.findAll(params);
  }
}

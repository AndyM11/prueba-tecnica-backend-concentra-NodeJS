import { ManufacturerRepository } from "../../repositories/ManufacturerRepository";
import { Manufacturer } from "../../entities/Manufacturer";

export class GetAllManufacturersUseCase {
  constructor(private manufacturerRepo: ManufacturerRepository) {}

  async execute(options?: {
    name?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    total: number;
    data: Manufacturer[];
    current_page: number;
    per_page: number;
    last_page: number;
  }> {
    if (options) {
      return await this.manufacturerRepo.findByFilter(options);
    }
    // Si no hay opciones, devolver todos como antes
    const data = await this.manufacturerRepo.findAll();
    return {
      total: data.length,
      data,
      current_page: 1,
      per_page: data.length,
      last_page: 1,
    };
  }
}

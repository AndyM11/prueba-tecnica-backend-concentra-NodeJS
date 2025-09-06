import { ManufacturerRepository } from "../../repositories/ManufacturerRepository";
import { Manufacturer } from "../../entities/Manufacturer";

export class UpdateManufacturerUseCase {
  constructor(private manufacturerRepo: ManufacturerRepository) {}

  async execute(id: number, name: string): Promise<Manufacturer> {
    return await this.manufacturerRepo.update(id, name);
  }
}

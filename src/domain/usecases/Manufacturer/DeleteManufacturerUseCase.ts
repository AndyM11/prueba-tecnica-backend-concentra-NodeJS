import { ManufacturerRepository } from "../../repositories/ManufacturerRepository";

export class DeleteManufacturerUseCase {
  constructor(private manufacturerRepo: ManufacturerRepository) {}

  async execute(id: number): Promise<void> {
    await this.manufacturerRepo.delete(id);
  }
}

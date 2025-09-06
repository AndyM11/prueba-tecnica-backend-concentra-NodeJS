import { LocationRepository } from "../../repositories/LocationRepository";
import { Location } from "../../entities/Location";

export class UpdateLocationUseCase {
  constructor(private locationRepo: LocationRepository) {}

  async execute(id: number, data: { name?: string }): Promise<Location | null> {
    return this.locationRepo.update(id, data);
  }
}

import { LocationRepository } from "../../repositories/LocationRepository";
import { Location } from "../../entities/Location";

export class GetLocationByIdUseCase {
  constructor(private locationRepo: LocationRepository) {}

  async execute(id: number): Promise<Location | null> {
    return this.locationRepo.getById(id);
  }
}

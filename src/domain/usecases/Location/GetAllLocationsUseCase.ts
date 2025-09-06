import { LocationRepository } from "../../repositories/LocationRepository";
import { Location } from "../../entities/Location";

export class GetAllLocationsUseCase {
  constructor(private locationRepo: LocationRepository) {}

  async execute(): Promise<Location[]> {
    return this.locationRepo.getAll();
  }
}

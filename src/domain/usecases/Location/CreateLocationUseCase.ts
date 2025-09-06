import { LocationRepository } from "../../repositories/LocationRepository";
import { Location } from "../../entities/Location";

export class CreateLocationUseCase {
  constructor(private locationRepo: LocationRepository) {}

  async execute(data: { name: string }): Promise<Location> {
    return this.locationRepo.create(data);
  }
}

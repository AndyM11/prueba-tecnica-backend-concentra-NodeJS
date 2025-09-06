import { PlacementRepository } from "../../repositories/PlacementRepository";

export class GetAllPlacementsUseCase {
  constructor(private repo: PlacementRepository) {}
  async execute(options?: {
    articleId?: number;
    locationId?: number;
    displayName?: string;
    price?: number;
    page?: number;
    per_page?: number;
  }) {
    return await this.repo.findByFilter(options);
  }
}

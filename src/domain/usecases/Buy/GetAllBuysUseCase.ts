import { BuyRepository } from "../../repositories/BuyRepository";

export class GetAllBuysUseCase {
  constructor(private repo: BuyRepository) {}
  async execute(options?: {
    clientId?: number;
    placementId?: number;
    units?: number;
    page?: number;
    per_page?: number;
  }) {
    return await this.repo.findByFilter(options);
  }
}

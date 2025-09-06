import { BuyRepository } from "../../repositories/BuyRepository";

export class GetBuyByIdUseCase {
  constructor(private repo: BuyRepository) {}
  async execute(id: number) {
    return await this.repo.findById(id);
  }
}

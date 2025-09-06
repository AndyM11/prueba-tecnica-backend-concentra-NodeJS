import { BuyRepository } from "../../repositories/BuyRepository";
import { Buy } from "../../entities/Buy";

export class UpdateBuyUseCase {
  constructor(private repo: BuyRepository) {}
  async execute(
    id: number,
    data: Partial<Omit<Buy, "id">>,
  ): Promise<Buy | null> {
    return await this.repo.update(id, data);
  }
}

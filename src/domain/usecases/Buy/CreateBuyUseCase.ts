import { BuyRepository } from "../../repositories/BuyRepository";
import { Buy } from "../../entities/Buy";

export class CreateBuyUseCase {
  constructor(private repo: BuyRepository) {}
  async execute(data: Omit<Buy, "id">): Promise<Buy> {
    return await this.repo.create(data);
  }
}

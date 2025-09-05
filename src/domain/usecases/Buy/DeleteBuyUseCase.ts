import { BuyRepository } from '../../repositories/BuyRepository';

export class DeleteBuyUseCase {
    constructor(private repo: BuyRepository) { }
    async execute(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}

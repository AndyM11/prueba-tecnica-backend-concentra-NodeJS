import { PlacementRepository } from '../../repositories/PlacementRepository';

export class DeletePlacementUseCase {
    constructor(private repo: PlacementRepository) { }
    async execute(id: number) {
        await this.repo.delete(id);
    }
}

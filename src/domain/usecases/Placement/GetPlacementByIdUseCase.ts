import { PlacementRepository } from '../../repositories/PlacementRepository';

export class GetPlacementByIdUseCase {
    constructor(private repo: PlacementRepository) { }
    async execute(id: number) {
        return await this.repo.findById(id);
    }
}

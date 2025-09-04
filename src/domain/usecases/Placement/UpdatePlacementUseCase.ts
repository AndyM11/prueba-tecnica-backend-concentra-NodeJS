import { PlacementRepository } from '../../repositories/PlacementRepository';
import { Placement } from '../../entities/Placement';

export class UpdatePlacementUseCase {
    constructor(private repo: PlacementRepository) { }
    async execute(id: number, data: Partial<Omit<Placement, 'id'>>) {
        return await this.repo.update(id, data);
    }
}

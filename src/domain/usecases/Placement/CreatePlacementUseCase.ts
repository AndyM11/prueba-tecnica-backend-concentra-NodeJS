import { PlacementRepository } from '../../repositories/PlacementRepository';
import { Placement } from '../../entities/Placement';

export class CreatePlacementUseCase {
    constructor(private repo: PlacementRepository) { }
    async execute(data: Omit<Placement, 'id'>) {
        return await this.repo.create(data);
    }
}

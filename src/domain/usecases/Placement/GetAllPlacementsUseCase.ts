import { PlacementRepository } from '../../repositories/PlacementRepository';

export class GetAllPlacementsUseCase {
    constructor(private repo: PlacementRepository) { }
    async execute(options?: {
        articuloId?: number;
        ubicacionId?: number;
        nombreExhibido?: string;
        precio?: number;
        page?: number;
        per_page?: number;
    }) {
        return await this.repo.findByFilter(options);
    }
}

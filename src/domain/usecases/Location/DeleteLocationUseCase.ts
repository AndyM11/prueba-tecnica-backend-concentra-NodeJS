import { LocationRepository } from '../../repositories/LocationRepository';

export class DeleteLocationUseCase {
    constructor(private locationRepo: LocationRepository) { }

    async execute(id: number): Promise<void> {
        await this.locationRepo.delete(id);
    }
}

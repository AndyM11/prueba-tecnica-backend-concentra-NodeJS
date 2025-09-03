import { ManufacturerRepository } from '../../repositories/ManufacturerRepository';
import { Manufacturer } from '../../entities/Manufacturer';

export class GetManufacturerByIdUseCase {
    constructor(private manufacturerRepo: ManufacturerRepository) { }

    async execute(id: number): Promise<Manufacturer | null> {
        return await this.manufacturerRepo.findById(id);
    }
}

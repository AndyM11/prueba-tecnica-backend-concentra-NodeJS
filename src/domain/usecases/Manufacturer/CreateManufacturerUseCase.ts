import { ManufacturerRepository } from '../../repositories/ManufacturerRepository';
import { Manufacturer } from '../../entities/Manufacturer';

export class CreateManufacturerUseCase {
    constructor(private manufacturerRepo: ManufacturerRepository) { }

    async execute({ name }: { name: string }): Promise<Manufacturer> {
        return await this.manufacturerRepo.create(name);
    }
}

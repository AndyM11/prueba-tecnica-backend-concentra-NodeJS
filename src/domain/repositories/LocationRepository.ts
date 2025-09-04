import { Location } from '../entities/Location';

export interface LocationRepository {
    create(data: { name: string }): Promise<Location>;
    getById(id: number): Promise<Location | null>;
    getAll(): Promise<Location[]>;
    update(id: number, data: { name?: string }): Promise<Location | null>;
    delete(id: number): Promise<void>;
}
